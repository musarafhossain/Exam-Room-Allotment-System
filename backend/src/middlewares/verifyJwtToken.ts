import jwt from "jsonwebtoken";
import { IUser, UserJwtTokenModel, UserModel } from "../models";
import { Request, Response, NextFunction } from "express";
import config from "../config/config";

// Verify jwt token
const verifyJwtToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers['authorization'];
        const jwtToken = authHeader?.split(' ')[1];

        if (!jwtToken) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        const tokenRecord = await UserJwtTokenModel.findOne({ jwtToken });

        if (!tokenRecord) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(jwtToken, config.jwtTokenSecretKey, {
                ignoreExpiration: true
            }) as IUser;
        } catch {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const user = await UserModel.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.error("JWT middleware error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
};

export default verifyJwtToken;