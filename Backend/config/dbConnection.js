import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnection = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        // console.log(
        //     "database connected:",
        //     connect.connection.host,
        //     connect.connection.name
        // );
    } catch (err) {
        process.exit();
    }
};

export default dbConnection;