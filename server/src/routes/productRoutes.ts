import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { createProduct, deleteProduct, editProduct, getProducts } from "../controllers/productController";
import { handleValidation, productValidation } from "../middlewares/validationMiddleware";

const prouductRoutes = Router()

prouductRoutes.get('/products', authenticateJWT, getProducts)
prouductRoutes.post('/create', authenticateJWT, productValidation, handleValidation, createProduct)
prouductRoutes.put('/edit/:productId', authenticateJWT, productValidation, handleValidation, editProduct)
prouductRoutes.delete("/delete/:productId", authenticateJWT, deleteProduct);


export default prouductRoutes