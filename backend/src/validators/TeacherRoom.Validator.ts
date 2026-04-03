import { z } from "zod";

class TeacherRoomValidator {
    createTeacherRoomSchema = z.object({
        name: z.string().min(1, "Teacher name is required"),
        roomNo: z.string().min(1, "Room number is required"),
        floor: z.string().optional(),
        building: z.string().optional(),
        time: z.string().min(1, "Time is required"),
        date: z.coerce.date(),
    });

    updateTeacherRoomSchema = z.object({
        name: z.string().min(1).optional(),
        roomNo: z.string().min(1).optional(),
        floor: z.string().optional(),
        building: z.string().optional(),
        time: z.string().min(1).optional(),
        date: z.coerce.date().optional(),
    });

    findTeacherRoomSchema = z.object({
        name: z.string().min(1, "Teacher name is required"),
        date: z.coerce.date({ error: "Invalid date" })
    });
}

export default new TeacherRoomValidator();
