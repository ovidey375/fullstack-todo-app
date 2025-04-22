import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = ({ setToken }) => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://fullstack-todo-app-69m3.onrender.com/api/todo/alltodos",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const fetchedTodos = response.data?.getAllTodo || [];
        setTodos(fetchedTodos);
        setError(null);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const todoCreate = async () => {
    try {
      if (!newTodo.trim()) return;
      const response = await axios.post(
        "https://fullstack-todo-app-69m3.onrender.com/api/todo/create",
        {
          text: newTodo,
          completed: false,
        },
        {
          withCredentials: true,
        }
      );
      const newItem = response.data?.newTodo;
      if (newItem) {
        setTodos([...todos, newItem]);
        setNewTodo("");
      } else {
        toast.error("Something went wrong while creating the todo.");
      }
    } catch (error) {
      console.error("Create error:", error);
      setError("Failed to create todo");
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;
    try {
      const response = await axios.put(
        `https://fullstack-todo-app-69m3.onrender.com/api/todo/update/${id}`,
        {
          ...todo,
          completed: !todo.completed,
        },
        { withCredentials: true }
      );
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (error) {
      console.error("Status update error:", error);
      setError("Failed to update todo status");
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(
        `https://fullstack-todo-app-69m3.onrender.com/api/todo/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete todo");
    }
  };

  const logout = async () => {
    try {
      await axios.get(
        "https://fullstack-todo-app-69m3.onrender.com/api/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success("User Logout Successfully");
      setToken(null);
      localStorage.removeItem("jwt");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  const remainingTodos = Array.isArray(todos)
    ? todos.filter((todo) => !todo.completed).length
    : 0;

  return (
    <div className="my-10 bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && todoCreate()}
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={todoCreate}
          className="bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300"
        >
          Add
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <li
              key={todo._id || index}
              className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoStatus(todo._id)}
                  className="mr-2"
                />
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-800 font-semibold"
                      : ""
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => todoDelete(todo._id)}
                className="text-red-500 hover:text-red-800 duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-center text-sm text-gray-700">
        {remainingTodos} remaining todos
      </p>
      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 mx-auto block"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
