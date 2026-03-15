import mongoose from 'mongoose';
import config from './config';

const connectDB = async () => {
    try {
        const DB_OPTIONS: mongoose.ConnectOptions = {
            dbName: config.database.databaseName
        }
        await mongoose.connect(config.database.databaseUrl, DB_OPTIONS);
        console.log(`Connected Successfully to ${config.database.databaseName}...`);
    } catch (err: any) {
        console.error('Some Problem Occurred:', err.message);
        process.exit(1);
    }
}

export default connectDB;