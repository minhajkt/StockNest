import { Request, Response } from "express";
import User from "../models/User";
import { HttpStatus } from "../utils/httpStatus";
import bcrypt from 'bcryptjs'
import { MESSAGES } from "../utils/messages";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token";
import jwt from 'jsonwebtoken'

export const registerUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const {name, email, password} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser) {
            res.status(HttpStatus.BAD_REQUEST).json({message:  MESSAGES.USER_ALREADY_EXISTS})
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({name, email, password: hashedPassword})
        res.status(HttpStatus.CREATED).json({message: MESSAGES.USER_REGISTRATION_SUCCESS, newUser})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}

export const loginUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            console.log('noy')
            res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.USER_NOT_FOUND})
            return
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword) {
            res.status(HttpStatus.BAD_REQUEST).json({message: MESSAGES.INCORRECT_PASSWORD})
            return
        }

        const accessToken = generateAccessToken({userId: user._id, email: user.email})
        const refreshToken = generateRefreshToken({userId: user._id, email: user.email})

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        
        res.status(HttpStatus.OK).json({message: MESSAGES.LOGIN_SUCCESS, user, accessToken})
        return
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
}

export const refreshToken = async(req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.refreshToken
        if(!token) {
            res.status(HttpStatus.UNAUTHORIZED).json({message:MESSAGES.N0_REFRESH_TOKEN})
            return
        }
        const decoded = verifyRefreshToken(token) as jwt.JwtPayload
        if(!decoded) {
            res.status(HttpStatus.FORBIDDEN).json({message: MESSAGES.INVALID_REFRESH_TOKEN})
            return
        }

        const accessToken = generateAccessToken({userId: decoded.userId, email: decoded.email})
        res.status(HttpStatus.OK).json({accessToken})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
    }
}

export const logoutUser = async(req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'strict'
        })
        res.status(HttpStatus.OK).json({message:MESSAGES.LOGOUT_SUCCESS})
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
} 