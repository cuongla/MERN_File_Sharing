import mongoose, { Document, mongo } from 'mongoose';
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    secure_url: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    sizeInBytes: {
        type: String,
        required: true
    },
    sender: {
        type: String
    },
    reciever: {
        type: String
    },
}, { timestamps: true });

interface IFile extends Document {
    filename: string;
    secure_url: string;
    sizeInBytes: string;
    format: string;
    sender?: string;
    receiver?: string;
}

export default mongoose.model<IFile>("File", FileSchema);