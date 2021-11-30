import express from "express";
import path from "path";
import DBConn from "./config/db.js";
import roomsRouter from "./routes/roomsRoute.js";
import usersRouter from "./routes/usersRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/rooms", roomsRouter);
app.use("/api/users", usersRouter);
app.use("/api/bookings", bookingRoute);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
}

const PORT = process.env.PORT || 5000;

DBConn();
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
