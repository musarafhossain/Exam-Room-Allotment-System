import { z } from "zod";

class UserValidator {
    createUserSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email"),
        password: z.string().min(6),
    });

    updateUserSchema = z.object({
        name: z.string().min(1, "Name is required").optional(),
        email: z.email("Invalid email").optional(),
    });
}

export default new UserValidator();