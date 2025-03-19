import { Router } from "express";
import { createSale, getCustomerLedger, getSales, sendReport } from "../controllers/salesController";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { handleValidation, salesValidation } from "../middlewares/validationMiddleware";

const salesRoutes = Router()

salesRoutes.get('/sales', authenticateJWT,getSales)
salesRoutes.post("/create", authenticateJWT, salesValidation, handleValidation, createSale);
salesRoutes.post('/send-mail', authenticateJWT, sendReport)
salesRoutes.get('/customer-ledger',authenticateJWT ,getCustomerLedger)

export default salesRoutes;