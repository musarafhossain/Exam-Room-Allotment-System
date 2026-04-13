import { z } from "zod";

class PaperValidator {
    createPaperSchema = z.object({
        name: z.string().min(1, "Name is required")
    });

    updatePaperSchema = z.object({
        name: z.string().min(1).optional()
    });
}

export default new PaperValidator();
