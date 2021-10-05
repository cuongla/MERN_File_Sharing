import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {});
    } catch (error) {
        console.log(`Connectiong DB Error ${error.message}`);
    }

    const connectiong = mongoose.connection;
    if (connectiong.readyState >= 1) {
        console.log(`Connecting to databse`);
        return;
    }
    connectiong.on("error", () => console.log("Connection Failed"));
}


export default connectDB;