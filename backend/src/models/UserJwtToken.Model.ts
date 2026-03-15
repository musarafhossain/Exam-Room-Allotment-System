import mongoose, { Schema } from "mongoose";

const userJwtTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jwtToken: {
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
}, { timestamps: true });

export default mongoose.model('UserJwtToken', userJwtTokenSchema);