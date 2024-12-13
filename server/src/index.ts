import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import taskRouter from './routes/taskRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string);
        console.log('Successfully connected to MongoDB');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log('Unable to connect to database', error.message);
        } else {
            console.log('Unable to connect to database', error);
        }
    }
};

connectDatabase();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/v1', userRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1', taskRouter);

app.get('/', (request: Request, response: Response) => {
    response.json('Hello, TaskMaster API!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
