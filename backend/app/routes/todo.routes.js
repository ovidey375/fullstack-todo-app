import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  updateTodo,
} from "../controller/todo.controller.js";
import { authenticate } from "../middleware/authorize.js";

const todoRouter = express.Router();

todoRouter.post("/create", authenticate, createTodo);
todoRouter.get("/alltodos", authenticate, getTodo);
todoRouter.put("/update/:id", authenticate, updateTodo);
todoRouter.delete("/delete/:id", authenticate, deleteTodo);

export default todoRouter;
