import { z } from "zod";

class AuthValidator {
    loginSchema = z.object({
        email: z.string().email("Invalid email").min(1, "Email is required"),
        password: z.string().min(1, "Password is required"),
    });

    forgotPasswordSchema = z.object({
        email: z.string().email("Invalid email").min(1, "Email is required"),
    });

    resetPasswordSchema = z.object({
        token: z.string().min(1, "Token is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });
}

export default new AuthValidator();