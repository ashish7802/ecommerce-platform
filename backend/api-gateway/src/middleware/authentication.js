// Adds request identity data so controllers can behave like authenticated endpoints.
export function attachAuthentication(request, _response, next) {
  request.context = {
    requestId: request.header("x-request-id") || `req-${Date.now()}`,
    identity: {
      userId: request.header("x-user-id") || "guest",
      roles: (request.header("x-user-roles") || "guest")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    }
  };

  next();
}
