import { z } from "zod";

class TeacherRoomValidator {
    createTeacherRoomSchema = z.object({
        roomNo: z.string().min(1, "Room number is required"),
        floor: z.string().optional(),
        building: z.string().optional(),
        time: z.string().min(1, "Time is required"),
        date: z.coerce.date(),
    });

    updateTeacherRoomSchema = z.object({
        roomNo: z.string().min(1).optional(),
        floor: z.string().optional(),
        building: z.string().optional(),
        time: z.string().min(1).optional(),
        date: z.coerce.date().optional(),
    });
}

export default new TeacherRoomValidator();
