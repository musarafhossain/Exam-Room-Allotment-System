import mongoose from "mongoose";

const studentRoomSchema = new mongoose.Schema({
    roomNo: {
        type: String,
        required: true
    },
    floor: String,
    building: String,
    examType: {
        type: String,
        enum: ['UG/PG', 'Others'],
        default: 'UG/PG'
    },
    examName: String,
    subject: String,
    paper: String,
    semester: Number,
    time: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    regNoFrom: {
        type: String,
        required: true
    },
    regNoTo: {
        type: String,
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

export default mongoose.model("StudentRoom", studentRoomSchema);