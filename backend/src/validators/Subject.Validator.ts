import { z } from "zod";

class SubjectValidator {
    createSubjectSchema = z.object({
        name: z.string().min(1, "Name is required")
    });

    updateSubjectSchema = z.object({
        name: z.string().min(1).optional()
    });
}

export default new SubjectValidator();
