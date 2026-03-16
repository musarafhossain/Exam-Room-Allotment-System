import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
    {
        semester: {
            type: Number,
            required: true
        },
        department: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            required: true
        },

        paper: {
            type: String,
            required: true
        },

        shift: {
            type: String,
            enum: ["morning", "afternoon"],
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        duration: {
            type: Number, // minutes
            required: true
        },

        regNoFrom: {
            type: String,
            required: true
        },

        regNoTo: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const examSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        subjects: [subjectSchema]
    },
    { _id: false }
);

const studentRoomSchema = new mongoose.Schema(
    {
        roomNo: {
            type: String,
            required: true
        },

        roomName: String,

        floor: String,

        building: String,

        exams: [examSchema]
    },
    { timestamps: true }
);

export default mongoose.model("StudentRoom", studentRoomSchema);