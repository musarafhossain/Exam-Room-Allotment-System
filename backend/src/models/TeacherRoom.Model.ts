import mongoose from "mongoose";

export const teacherRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shift1Start: {
        type: String
    },
    shift1End: {
        type: String
    },
    shift2Start: {
        type: String
    },
    shift2End: {
        type: String
    },
    shift1: {
        type: Boolean,
        default: false
    },
    shift2: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true }
);

export default mongoose.model("TeacherRoom", teacherRoomSchema);