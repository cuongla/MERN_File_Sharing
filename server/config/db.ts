import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
    } catch (err) {
        console.log(`DB Error: ${err.message}`);
    }

    const connectiong = mongoose.connection;
    if (connectiong.readyState >= 1) {
        console.log(`Connecting to database`);
        return;
    }
    connectiong.on("error", () => console.log("Connection Failed"));
}


export default connectDB;