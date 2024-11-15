import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(express.json());
app.use(cookieParser());

app.get('/', (request: Request, response: Response) => {
    response.json('Test ok!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
