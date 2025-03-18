import { Request, Response } from "express";
import Product from "../models/Product";
import { HttpStatus } from "../utils/httpStatus";
import { MESSAGES } from "../utils/messages";
import mongoose from "mongoose";

interface authenticatedRequest extends Request {
  user?: { userId: string };
}

export const getProducts = async (req: authenticatedRequest,res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const products = await Product.find({ createdBy: userId });
    res.status(HttpStatus.OK).json({ message: MESSAGES.CUSTOMERS_FETCHED, products });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
  }
};


export const createProduct = async(req: authenticatedRequest, res: Response): Promise<void> => {
    try {
        const {name, description, quantity, price} = req.body
        const userId = req.user?.userId
        if(!userId) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.USER_NOT_FOUND})
            return
        }

        const existingProduct = await Product.findOne({name, createdBy: userId})
        if(existingProduct) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.PRODUCT_ALREADY_EXISTS})
            return
        }

        const newProduct = await Product.create({name, description, quantity,price,createdBy:userId})
        res.status(HttpStatus.CREATED).json({message: MESSAGES.PRODUCT_CREATED, newProduct})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}


export const editProduct = async(req: authenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId
        const productId = req.params.productId;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({ message: "Invalid product ID" });
           return;
        }

        const { name, description, quantity, price } = req.body;

        const existingProduct = await Product.findOne({name, createdBy: userId, _id: { $ne: productId }})
        if(existingProduct) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.PRODUCT_ALREADY_EXISTS})
            return
        }

        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.productId,
          { name, description, quantity, price },
          { new: true }
        );
        if(!updatedProduct) {
            res.status(HttpStatus.NOT_FOUND).json({messsage: MESSAGES.PRODUCT_NOT_FOUND})
            return
        }
        res.status(HttpStatus.OK).json(updatedProduct)
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})        
    }
}


export const deleteProduct = async(req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
           res.status(400).json({ message: "Invalid Product ID" });
           return;
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct) {
            res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.PRODUCT_NOT_FOUND})
            return
        }
        res.status(HttpStatus.OK).json({message:MESSAGES.PRODUCT_DELETED_SUCCESSFULLY});
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})        
    }
}