import { UserModel, UserJwtTokenModel } from "../models";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateJwtToken } from "../utils/helpers";
import { sendEmail } from "../services/EmailService";
import config from "../config/config";

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

        const token = req.token;
        await UserJwtTokenModel.deleteOne({ jwtToken: token });

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

    forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password?token=${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please click on the following link to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;

        try {
            await sendEmail(user.email, 'Password Reset Request', message);
            res.json({
                success: true,
                message: "Email sent successfully"
            })
        } catch (error: any) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: "Email could not be sent"
            })
        }
    }

    resetPasswordForm = async (req: Request, res: Response) => {
        const { token } = req.query;

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f9;">
                        <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                            <h1 style="color: #e74c3c;">Invalid or Expired Token</h1>
                            <p>The password reset link is invalid or has expired. Please request a new one.</p>
                        </div>
                    </body>
                </html>
            `);
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <style>
                    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .container { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; }
                    h2 { color: #1e293b; margin-bottom: 1.5rem; text-align: center; }
                    .form-group { margin-bottom: 1.25rem; }
                    label { display: block; margin-bottom: 0.5rem; color: #64748b; font-size: 0.875rem; }
                    input { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; transition: border-color 0.2s; }
                    input:focus { outline: none; border-color: #3b82f6; ring: 2px solid #bfdbfe; }
                    button { width: 100%; padding: 0.75rem; background-color: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
                    button:hover { background-color: #2563eb; }
                    .message { margin-top: 1rem; text-align: center; font-size: 0.875rem; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Reset Your Password</h2>
                    <form id="resetForm">
                        <input type="hidden" name="token" value="${token}">
                        <div class="form-group">
                            <label for="password">New Password</label>
                            <input type="password" id="password" name="password" required minlength="6" placeholder="Enter new password">
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6" placeholder="Confirm new password">
                        </div>
                        <button type="submit">Update Password</button>
                    </form>
                    <div id="responseMessage" class="message"></div>
                </div>

                <script>
                    document.getElementById('resetForm').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const password = document.getElementById('password').value;
                        const confirmPassword = document.getElementById('confirmPassword').value;
                        const token = "${token}";

                        if (password !== confirmPassword) {
                            document.getElementById('responseMessage').innerText = "Passwords do not match";
                            document.getElementById('responseMessage').style.color = "#e74c3c";
                            return;
                        }

                        try {
                            const response = await fetch('/api/v1/auth/reset-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token, password })
                            });
                            const result = await response.json();
                            
                            const msgDiv = document.getElementById('responseMessage');
                            msgDiv.innerText = result.message;
                            
                            if (result.success) {
                                msgDiv.style.color = "#10b981";
                                document.getElementById('resetForm').style.display = 'none';
                            } else {
                                msgDiv.style.color = "#e74c3c";
                            }
                        } catch (error) {
                            document.getElementById('responseMessage').innerText = "An error occurred. Please try again.";
                            document.getElementById('responseMessage').style.color = "#e74c3c";
                        }
                    });
                </script>
            </body>
            </html>
        `);
    }

    resetPassword = async (req: Request, res: Response) => {
        const { token, password } = req.body;

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({
            success: true,
            message: "Password reset successfully"
        })
    }
}

export default new AuthController();