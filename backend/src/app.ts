import express from 'express';
import { UserRouter, AuthRouter, StudentRoomRouter } from './routes';
import connectDB from './config/db';

const app = express();

connectDB();

app.use(express.json());

//Hello World
app.get('/', (req, res) => {
    res.json({ "message": "Hello World!" });
});

// Routes
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/student-rooms', StudentRoomRouter);
app.use('/api/v1/auth', AuthRouter);

export default app;