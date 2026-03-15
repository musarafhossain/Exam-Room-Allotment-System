import { z } from "zod";

class AuthValidator {
    loginSchema = z.object({
        email: z.email("Invalid email").min(1, "Email is required"),
        password: z.string().min(1, "Password is required"),
    });
}

export default new AuthValidator();