"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const https_1 = __importDefault(require("https"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = require("cloudinary");
const file_model_1 = __importDefault(require("../models/file.model"));
const emailTemplates_1 = require("../utils/emailTemplates");
const router = express_1.default.Router();
// multer
const storage = multer_1.default.diskStorage({});
let upload = multer_1.default({ storage });
router.post('/upload', upload.single("myFile"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File is missing"
            });
        }
        let uploadedFile;
        try {
            uploadedFile = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "ShareFile",
                resource_type: "auto"
            });
        }
        catch (error) {
            res.status(400).json({ message: "Cloudinary Error :(" });
        }
        // upload file
        const { originalname } = req.file;
        const { secure_url, bytes, format } = uploadedFile;
        console.log(uploadedFile);
        const file = yield file_model_1.default.create({
            filename: originalname,
            sizeInBytes: bytes,
            secure_url,
            format
        });
        res.status(200).json({
            id: file._id,
            downloadPageLink: `${process.env.CLIENT_END_POINT}/download/${file._id}`
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const file = yield file_model_1.default.findById(id);
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
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
}));
router.get('/:id/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const file = yield file_model_1.default.findById(id);
        if (!file) {
            return res.status(404).json({
                message: "File does not exist"
            });
        }
        https_1.default.get(file.secure_url, (fileStream) => fileStream.pipe(res));
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
}));
router.post('/email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, emailFrom, emailTo } = req.body;
        const file = yield file_model_1.default.findById(id);
        if (!file)
            return res.status(404).json({ message: 'File does not exist' });
        // transporter
        let transporter = nodemailer_1.default.createTransport({
            // @ts-ignore
            host: process.env.SENDINBLUE_SMTP_HOST,
            port: process.env.SENDINBLUE_SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SENDINBLUE_SMTP_USER,
                pass: process.env.SENDINBLUE_SMTP_PASSWORD
            }
        });
        console.log(transporter);
        const { filename, sizeInBytes } = file;
        const filesize = `${(Number(sizeInBytes) / (1024 * 1024)).toFixed(2)} MB`;
        const downloadPageLink = `${process.env.CLIENT_END_POINT}/download/${id}`;
        // email options
        const emailOptions = {
            from: emailFrom,
            to: emailTo,
            subket: "File is shared with you",
            text: `${emailFrom} shared a file with you`,
            html: emailTemplates_1.emailTemplate(emailFrom, downloadPageLink, filename, filesize)
        };
        // send email
        transporter.sendMail(emailOptions, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Server Error :("
                });
            }
            ;
            file.sender = emailFrom;
            file.receiver = emailTo;
            yield file.save();
            return res.status(200).json({
                message: "Email Sent"
            });
        }));
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
}));
exports.default = router;
//# sourceMappingURL=file.routes.js.map