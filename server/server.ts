import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

import connectDB from './config/db';
import FileRoute from './routes/file.routes';

const app = express();
dotenv.config();

// cloudinary set up
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// connecdb
connectDB();

// middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get('/', (req, res) => res.send('Hello from Express!'));

// routes
app.use('/api/files', FileRoute);

// connecting to PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));