import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { UserModel } from "../models";

class UserController {
    getUsers = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const users = await UserModel.find().skip(skip).limit(limit);
        const total = await UserModel.countDocuments();
        const lastPage = Math.ceil(total / limit);

        res.json({
            "message": "Users get successfully",
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
                "message": "User not found"
            })
        }

        res.json({
            "message": "User get successfully",
            data: user
        })
    }

    createUser = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                "message": "User already exists"
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
            "message": "User created successfully",
            data: user
        })
    }

    updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, email } = req.body;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (email) {
            const userExists = await UserModel.findOne({
                email,
                _id: { $ne: id } // exclude current user
            });

            if (userExists) {
                return res.status(400).json({
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
            message: "User updated successfully",
            data: user
        });
    }

    deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                "message": "User not found"
            })
        }

        await user.deleteOne();

        res.json({
            "message": "User deleted successfully",
            data: user
        })
    }
}

export default new UserController();
