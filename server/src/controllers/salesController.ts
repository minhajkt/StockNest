import { Request, Response } from "express";
import Sales, { ISale } from "../models/Sales";
import { HttpStatus } from "../utils/httpStatus";
import { MESSAGES } from "../utils/messages";
import Product from "../models/Product";
import { sendSalesReportEmail } from "../utils/sendMail";
import { generateSalesReportPDF } from "../utils/salesReport";

interface authenticatedRequest extends Request {
  user?: { userId: string };
}

export const getSales = async(req:authenticatedRequest, res: Response) : Promise<void> => {
    try {
        const userId = req.user?.userId
        const sales = await Sales.find({createdBy: userId}).populate('product')
        res.status(HttpStatus.OK).json({message: MESSAGES.SALES_FETCHED, sales})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}


export const createSale = async(req: authenticatedRequest, res: Response): Promise<void> => {
    try {
        const {customer, product, quantity, price} = req.body
        const userId = req.user?.userId
        if(!userId) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.USER_NOT_FOUND})
            return
        }

        if(!customer) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.CUSTOMER_NOT_FOUND})
            return
        }

        const existingProduct = await Product.findOne({name: product}) 
        if(!existingProduct) {
            res.status(HttpStatus.BAD_REQUEST).json({message:MESSAGES.PRODUCT_NOT_FOUND})
            return
        }
        if(existingProduct.quantity < quantity) {
            res.status(HttpStatus.BAD_REQUEST).json({message: MESSAGES.STOCK_UNAVAILABLE})
            return
        }

        const newSale = await Sales.create({customer, product, quantity, price, createdBy:userId})
        existingProduct.quantity -= quantity
        await existingProduct.save()
        res.status(HttpStatus.CREATED).json({message: MESSAGES.SALE_CREATED, newSale})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}

export const sendReport = async(req: Request, res: Response): Promise<void> => {
    try {
        const {to} = req.body
        if(!to) {
            res.status(HttpStatus.BAD_REQUEST).json({message: MESSAGES.NO_TO_ADDRESS})
            return
        }
        
        const salesData = await Sales.find(
          {},
          "date customer product quantity price"
        ).lean();
        
        if (!salesData || salesData.length === 0) {
          res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.NO_SALESDATA });
          return;
        }
// console.log("Sales Data:", JSON.stringify(salesData, null, 2));
// console.log("Generating PDF...");
        const pdfPath = await generateSalesReportPDF(salesData as ISale[]);
// console.log("PDF Generated at:", pdfPath);
// console.log("Sending email to:", to);
        const result = await sendSalesReportEmail(to, pdfPath)
        // console.log("Email sent successfully:", result);
        res.status(HttpStatus.OK).json({message: MESSAGES.EMAIL_SENT})
    } catch (error) {
          console.error("Error in sendReport:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}

export const getCustomerLedger = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId
        const customerSales = await Sales.aggregate([
            {$match: { createdBy: userId }},
            {
                $group: {
                    _id: "$customer", 
                    totalAmount: { $sum: "$price" }, 
                    totalQuantity: { $sum: "$quantity" }, 
                    transactions: { $push: "$$ROOT" }, 
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json(customerSales);
    } catch (error) {
        console.error("Error fetching customer ledger", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


