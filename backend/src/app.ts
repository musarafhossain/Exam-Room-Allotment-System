import express from 'express';
import { UserRouter } from './routes';
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

export default app;