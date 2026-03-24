import express from "express";

import catalogRoutes from "./routes/catalogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { attachAuthentication } from "./middleware/authentication.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { HttpError } from "./lib/httpError.js";

const defaultPort = Number(process.env.PORT || 8080);

// Builds the Express app so tests can boot the server on ephemeral ports.
export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(attachAuthentication);
  app.use(rateLimiter);

  app.get("/health", (request, response) => {
    response.json({
      status: "ok",
      service: "api-gateway",
      requestId: request.context.requestId
    });
  });

  app.use("/api", catalogRoutes);
  app.use("/api", orderRoutes);
  app.use("/api", paymentRoutes);

  app.use((request, response) => {
    response.status(404).json({ error: "not_found", path: request.path, requestId: request.context?.requestId || null });
  });

  app.use((error, request, response, _next) => {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    response.status(statusCode).json({
      error: error.message || "internal_error",
      details: error.details || null,
      requestId: request.context?.requestId || null
    });
  });

  return app;
}

export function startServer(port = defaultPort) {
  const app = createApp();
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      const address = server.address();
      console.log(`api-gateway listening on port ${address.port}`);
      resolve(server);
    });
  });
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await startServer();
}
