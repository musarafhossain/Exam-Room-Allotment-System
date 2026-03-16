import { z } from "zod";

const subjectSchema = z.object({
    semester: z.number().min(1, "Semester is required"),
    department: z.string().min(1, "Department is required"),
    subject: z.string().min(1, "Subject is required"),
    paper: z.string().min(1, "Paper is required"),
    shift: z.enum(["morning", "afternoon"], {
        error: "Shift must be morning or afternoon"
    }),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    duration: z.number().min(1, "Duration must be greater than 0"),
    regNoFrom: z.string().min(1, "regNoFrom is required"),
    regNoTo: z.string().min(1, "regNoTo is required")
});

const examSchema = z.object({
    date: z.coerce.date(),
    subjects: z.array(subjectSchema).min(1, "At least one subject is required")
});

class StudentRoomValidator {
    createStudentRoomSchema = z.object({
        roomNo: z.string().min(1, "Room number is required"),
        roomName: z.string().optional(),
        floor: z.string().optional(),
        building: z.string().optional(),
        exams: z.array(examSchema).min(1, "At least one exam is required")
    });

    updateStudentRoomSchema = z.object({
        roomNo: z.string().min(1).optional(),
        roomName: z.string().optional(),
        floor: z.string().optional(),
        building: z.string().optional(),
        exams: z.array(examSchema).optional()
    });

    findStudentRoomSchema = z.object({
        regNo: z.string().min(1, "Registration number is required"),
        date: z.coerce.date({ error: "Invalid date" })
    });
}

export default new StudentRoomValidator();