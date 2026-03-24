import express from "express";

import { createOrder, listOrders, quoteOrder } from "../controllers/ordersController.js";

const router = express.Router();

// Order endpoints support quote, create, and list flows.
router.get("/orders", listOrders);
router.post("/orders/quote", quoteOrder);
router.post("/orders", createOrder);

export default router;
