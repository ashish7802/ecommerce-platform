import express from "express";

import { getProductBySku, listProducts } from "../controllers/productsController.js";

const router = express.Router();

// Product endpoints back storefront browse and product detail pages.
router.get("/products", listProducts);
router.get("/products/:sku", getProductBySku);

export default router;
