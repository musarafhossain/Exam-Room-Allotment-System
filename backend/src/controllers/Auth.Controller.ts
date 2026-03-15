import { UserModel, UserJwtTokenModel } from "../models";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { generateJwtToken } from "../utils/helpers";

class AuthController {
    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const { jwtToken } = await generateJwtToken(user);

        res.json({
            success: true,
            message: "User logged in successfully",
            data: {
                token: jwtToken,
                user
            }
        })
    }

    logout = async (req: Request, res: Response) => {
        const user = req.user;

        await UserJwtTokenModel.deleteMany({ userId: user?._id });

        res.json({
            success: true,
            message: "User logged out successfully",
            data: user
        })
    }

    me = async (req: Request, res: Response) => {
        const user = req.user;

        res.json({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    }
}

export default new AuthController();