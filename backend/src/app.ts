import express from 'express';
import cors from 'cors';
import { UserRouter, AuthRouter, StudentRoomRouter, TeacherRoomRouter, CBCSTeacherRoomRouter, SubjectRouter, PaperRouter, FloorRouter, BuildingRouter, SettingRouter } from './routes';
import connectDB from './config/db';

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

connectDB();

app.use(express.json());

//Hello World
app.get('/', (req, res) => {
    res.json({ "message": "Hello World!" });
});

// Routes
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/student-rooms', StudentRoomRouter);
app.use('/api/v1/teacher-rooms', TeacherRoomRouter);
app.use('/api/v1/cbcs-teacher-rooms', CBCSTeacherRoomRouter);
app.use('/api/v1/subjects', SubjectRouter);
app.use('/api/v1/papers', PaperRouter);
app.use('/api/v1/floors', FloorRouter);
app.use('/api/v1/buildings', BuildingRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/settings', SettingRouter);

export default app;