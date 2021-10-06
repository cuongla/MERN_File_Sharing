import express from 'express';
import multer from 'multer';
import https from 'https';
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
                message: "File is missing"
            });
        }

        let uploadedFile: UploadApiResponse;

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "ShareFile",
                resource_type: "auto"
            });
        } catch (error: any) {
            res.status(400).json({ message: "Cloudinary Error :(" });
        }

        // upload file
        const { originalname } = req.file;
        const { secure_url, bytes, format } = uploadedFile;
        console.log(uploadedFile);

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

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                message: "File does not exist"
            });
        }

        const { filename, format, sizeInBytes } = file;
        return res.status(200).json({
            name: filename,
            sizeInBytes,
            format,
            id
        })
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
});

router.get('/:id/download', async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                message: "File does not exist"
            });
        }

        https.get(file.secure_url, (fileStream) => fileStream.pipe(res));
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
});

export default router;