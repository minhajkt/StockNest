import { Request, Response } from "express";
import Customer from "../models/Customer";
import { HttpStatus } from "../utils/httpStatus";
import { MESSAGES } from "../utils/messages";
import mongoose from "mongoose";

interface authenticatedRequest extends Request{
    user? : {userId : string}
}

export const getCustomers = async(req: authenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId
        const customers = await Customer.find({createdBy: userId})
        res.status(HttpStatus.OK).json({message: MESSAGES.CUSTOMERS_FETCHED, customers})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}

export const createCustomer = async(req: authenticatedRequest, res: Response): Promise<void> => {
    try {
        const {name, address, mobile} = req.body
        const userId = req.user?.userId
        if(!userId) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.USER_NOT_FOUND})
            return
        }

        const existingAddress = await Customer.findOne({address})
        if(existingAddress) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.ADDRESS_ALREADY_EXISTS})
            return
        }

        const existingMobile = await Customer.findOne({ mobile, createdBy: userId });
        if (existingMobile) {
          res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: MESSAGES.MOBILE_ALREADY_EXISTS });
          return;
        }

        const newCustomer = await Customer.create({name, address, mobile,createdBy:userId})
        res.status(HttpStatus.CREATED).json({message: MESSAGES.CUSTOMER_CREATED, newCustomer})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}

export const editCustomer = async(req: Request, res: Response): Promise<void> => {
    try {
        const customerId = req.params.customerId;
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            res.status(400).json({ message: "Invalid Customer ID" });
           return;
        }
        const {name, address, mobile} = req.body

        const updatedCustomer = await Customer.findByIdAndUpdate(
          req.params.customerId,
          { name, address, mobile },
          { new: true }
        );
        if(!updatedCustomer) {
            res.status(HttpStatus.NOT_FOUND).json({messsage: MESSAGES.CUSTOMER_NOT_FOUND})
            return
        }
        res.status(HttpStatus.OK).json(updatedCustomer)
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})        
    }
}

export const deleteCustomer = async(req: Request, res: Response): Promise<void> => {
    try {
        const customerId = req.params.customerId
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
           res.status(400).json({ message: "Invalid Customer ID" });
           return;
        }

        const deletedCustomer = await Customer.findByIdAndDelete(customerId)
        if(!deletedCustomer) {
            res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.CUSTOMER_NOT_FOUND})
            return
        }
        res.status(HttpStatus.OK).json({message:MESSAGES.CUSTOMER_DELETED_SUCCESSFULLY});
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})        
    }
}