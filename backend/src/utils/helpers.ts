import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserJwtTokenModel, IUser } from '../models';
import config from '../config/config';

dotenv.config();

// Generate JWT token
export const generateJwtToken = async (user: IUser) => {
    try {
        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name,
        };

        const jwtToken = jwt.sign(
            { ...payload },
            config.jwtTokenSecretKey,
        );

        await UserJwtTokenModel.deleteMany({ userId: user._id });

        await UserJwtTokenModel.create({ userId: user._id, jwtToken });

        return { jwtToken };
    } catch (error) {
        throw error;
    }
}