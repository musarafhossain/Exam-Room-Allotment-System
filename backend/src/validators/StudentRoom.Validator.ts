import { z } from "zod";

class StudentRoomValidator {
    createStudentRoomSchema = z.object({
        roomNo: z.string().min(1, "Room number is required"),
        floor: z.string().optional(),
        building: z.string().optional(),
        subject: z.string().min(1, "Subject is required"),
        paper: z.string().min(1, "Paper is required"),
        semester: z.number().min(1, "Semester is required"),
        time: z.string().min(1, "Time is required"),
        date: z.coerce.date(),
        regNoFrom: z.string().min(1, "regNoFrom is required"),
        regNoTo: z.string().min(1, "regNoTo is required")
    });

    updateStudentRoomSchema = z.object({
        roomNo: z.string().min(1).optional(),
        floor: z.string().optional(),
        building: z.string().optional(),
        subject: z.string().min(1).optional(),
        paper: z.string().min(1).optional(),
        semester: z.number().min(1).optional(),
        time: z.string().min(1).optional(),
        date: z.coerce.date().optional(),
        regNoFrom: z.string().min(1).optional(),
        regNoTo: z.string().min(1).optional()
    });

    findStudentRoomSchema = z.object({
        regNo: z.string().min(1, "Registration number is required"),
        date: z.coerce.date({ error: "Invalid date" })
    });
}

export default new StudentRoomValidator();