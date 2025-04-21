import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./app/config/db.js";
import todoRouter from "./app/routes/todo.routes.js";
import userRouter from "./app/routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";

const app = express();
dotenv.config();
connectDb();

const _dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], // Add other headers you want to allow here.
  })
);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.use("/api/todo", todoRouter);
app.use("/api/user", userRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running port http://localhost:${port}`);
});
