import { Router } from "express";
import { createCustomer, deleteCustomer, editCustomer, getCustomers } from "../controllers/customerController";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { customerValidation, handleValidation } from "../middlewares/validationMiddleware";

const customerRoutes = Router()

customerRoutes.get("/customers", authenticateJWT, getCustomers);
customerRoutes.post('/create', authenticateJWT, customerValidation, handleValidation, createCustomer)
customerRoutes.put('/edit/:customerId', authenticateJWT, customerValidation, handleValidation, editCustomer)
customerRoutes.delete('/delete/:customerId', authenticateJWT, deleteCustomer)

export default customerRoutes;