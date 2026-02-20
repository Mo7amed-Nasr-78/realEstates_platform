import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./config/dbConnection.js";
import errorHandling from "./middlewares/errorHandling.js";
import { v2 as cloudinary } from "cloudinary";
import { init } from "./config/socket.io.js";
import compression from "compression";
// Routes
import authRouter from "./routes/Auth.js";
import userRouter from "./routes/User.js";
import propertyRouter from "./routes/Property.js";
import favoriteRouter from "./routes/Favorite.js";
import chatRouter from "./routes/Chat.js";
import bookingRouter from "./routes/Booking.js";
import notificationRouter from "./routes/Notification.js";
import { initSse } from "./config/initSSE.js";

dotenv.config();
const port = process.env.PORT | 3030;
const app = express();
const server = http.createServer(app);

// DB Connection
await dbConnection();
// socket.io setup
init(server);

// Cloudinary setup
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.FRONT_END_URL,
		credentials: true,
	})
);

// custom filter function
function shouldCompress(req, res) {
	if (req.path === "/events") {
		return false;
	}
	return compression.filter(req, res);
}

app.use(compression({ filter: shouldCompress }));

// Routes
app.use("/api/users", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/chat", chatRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/notification", notificationRouter);
app.use("/auth", authRouter);

// SSE Setup
app.get("/events", initSse);

// Error handling
app.use(errorHandling);

server.listen(port, () => {
	console.log(`The server is running on post: http://localhost:${port}`);
});
