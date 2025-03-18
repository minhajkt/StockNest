import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../utils/httpStatus";
import { MESSAGES } from "../utils/messages";
import { verifyAccessToken } from "../utils/token";

export const authenticateJWT = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]

    if(!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({message:MESSAGES.NO_ACCESS_TOKEN})
        return
    }

    const decoded = verifyAccessToken(token)
    if(!decoded) {
        res.status(HttpStatus.UNAUTHORIZED).json({message:MESSAGES.INVALID_ACCESS_TOKEN})
        return
    }

    (req as any).user = decoded
    next()
}