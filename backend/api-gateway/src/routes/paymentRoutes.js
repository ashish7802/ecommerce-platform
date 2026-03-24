import express from "express";

import { authorizePayment } from "../controllers/paymentController.js";

const router = express.Router();

// Payment endpoint simulates authorization during checkout.
router.post("/payments/authorize", authorizePayment);

export default router;
