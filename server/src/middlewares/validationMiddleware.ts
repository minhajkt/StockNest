import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator"
import { HttpStatus } from "../utils/httpStatus";

export const customerValidation = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("address").notEmpty().withMessage("Address cannot be empty"),
  body("mobile")
    .isNumeric()
    .withMessage("Mobile Number must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile Number must be 10 digits"),
];

export const productValidation = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("description").notEmpty().withMessage("Description cannot be empty"),
  body("quantity")
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a positive number"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")  
];

export const salesValidation = [
  body("quantity")
    .isFloat({ min: 1 })
    .withMessage("Quantity must be a positive number"),
];

export const handleValidation = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({errors: errors.array()})
        return
    }
    next();
}

