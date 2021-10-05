import express from 'express';
import multer from 'multer';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import File from '../models/file.model';
const router = express.Router();

// multer
const storage = multer.diskStorage({});
let upload = multer({ storage });

router.post('/upload', upload.single("myFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File is missing!"
            });
        }

        let uploadedFile: UploadApiResponse;

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path), {
                folder: "ShareFile",
                resource_type: "auto"
            };
        } catch (error: any) {
            res.status(400).json({ message: "Cloudinary Error :(" });
        }

        // upload file
        const { originalname } = req.file;
        const { secure_url, bytes, format } = uploadedFile;

        const file = await File.create({
            filename: originalname,
            sizeInBytes: bytes,
            secure_url,
            format
        });

        res.status(200).json({
            id: file._id,
            downloadPageLink: `${process.env.CLIENT_END_POINT}/download/${file._id}`
        });
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
});

export default router;