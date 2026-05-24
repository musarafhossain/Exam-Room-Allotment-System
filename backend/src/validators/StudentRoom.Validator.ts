import { z } from "zod";

class StudentRoomValidator {
    createStudentRoomSchema = z.object({
        examType: z.enum(['UG/PG', 'Others']).optional().default('UG/PG'),
        examName: z.string().optional(),
        roomNo: z.string().min(1, "Room number is required"),
        floor: z.string().optional(),
        building: z.string().optional(),
        subject: z.string().optional(),
        paper: z.string().optional(),
        semester: z.number().optional(),
        time: z.string().min(1, "Time is required"),
        date: z.coerce.date(),
        regNoFrom: z.string().min(1, "regNoFrom is required"),
        regNoTo: z.string().min(1, "regNoTo is required")
    });

    updateStudentRoomSchema = z.object({
        examType: z.enum(['UG/PG', 'Others']).optional(),
        examName: z.string().optional(),
        roomNo: z.string().min(1).optional(),
        floor: z.string().optional(),
        building: z.string().optional(),
        subject: z.string().optional(),
        paper: z.string().optional(),
        semester: z.number().optional(),
        time: z.string().min(1).optional(),
        date: z.coerce.date().optional(),
        regNoFrom: z.string().min(1).optional(),
        regNoTo: z.string().min(1).optional()
    });

    findStudentRoomSchema = z.object({
        regNo: z.string().min(1, "Registration number is required"),
        subject: z.string().optional(),
    });

    bulkUpdateDataSchema = z.object({
        examType: z.enum(['UG/PG', 'Others']).optional(),
        examName: z.string().optional(),
        roomNo: z.string().optional(),
        floor: z.string().optional(),
        building: z.string().optional(),
        subject: z.string().optional(),
        paper: z.string().optional(),
        semester: z.number().optional(),
        time: z.string().optional(),
        date: z.coerce.date().optional(),
        regNoFrom: z.string().optional(),
        regNoTo: z.string().optional()
    });

    bulkUpdateStudentRoomSchema = z.object({
        ids: z.array(z.string()).min(1, "At least one ID is required"),
        updateData: this.bulkUpdateDataSchema
    });
}

export default new StudentRoomValidator();