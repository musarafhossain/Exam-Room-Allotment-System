import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { UserModel } from "../models";
import { Types } from "mongoose";

class UserController {
    getUsers = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const query = req.user ? { _id: { $ne: req.user._id } } : {};

        const users = await UserModel.find(query).skip(skip).limit(limit);
        const total = await UserModel.countDocuments(query);
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Users get successfully",
            items: users,
            total: total,
            currentPage: page,
            lastPage: lastPage
        })
    }

    getUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.json({
            success: true,
            message: "User get successfully",
            data: user
        })
    }

    createUser = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.json({
            success: true,
            message: "User created successfully",
            data: user
        })
    }

    updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, email } = req.body;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (email) {
            const userExists = await UserModel.findOne({
                email,
                _id: { $ne: new Types.ObjectId(id as string) }
            });

            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }

            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        res.json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    }

    deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: "User deleted successfully",
            data: user
        })
    }
}

export default new UserController();
