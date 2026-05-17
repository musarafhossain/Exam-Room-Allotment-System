import { z } from "zod";

class TeacherRoomValidator {
    createTeacherRoomSchema = z.object({
        dates: z.array(z.object({
            date: z.string().min(1),
            shift1Start: z.string(),
            shift1End: z.string(),
            shift2Start: z.string(),
            shift2End: z.string(),
        })),
        teachers: z.array(z.object({
            name: z.string().min(1),
            assignments: z.array(z.object({
                shift1: z.boolean(),
                shift2: z.boolean(),
            }))
        }))
    });

    updateTeacherRoomSchema = z.object({
        name: z.string().min(1).optional(),
        date: z.coerce.date().optional(),
        shift1Start: z.string().optional(),
        shift1End: z.string().optional(),
        shift2Start: z.string().optional(),
        shift2End: z.string().optional(),
        shift1: z.boolean().optional(),
        shift2: z.boolean().optional(),
    });

    findTeacherRoomSchema = z.object({
        name: z.string().min(1, "Teacher name is required"),
        date: z.coerce.date({ error: "Invalid date" }).optional()
    });
}

export default new TeacherRoomValidator();
