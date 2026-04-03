import mongoose from "mongoose";

const teacherRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roomNo: {
        type: String,
        required: true
    },
    floor: String,
    building: String,
    time: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
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