import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Todos() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleTodos() {
      try {
        const data = await fetch("https://jsonplaceholder.typicode.com/todos");
        const response = await data.json();
        setTodos(response);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    }
    handleTodos();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading Todos...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Avatar Placeholder */}
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl font-bold mb-4">
            {todo.userId}
          </div>

          {/* Title */}
          <h2
            className="text-lg font-semibold text-gray-800 hover:cursor-pointer"
            onClick={() => navigate(`/Todos/${todo.id}`)}
          >
            {todo.title}
          </h2>

          {/* Status */}
          <p className="text-sm text-gray-500">
            {todo.completed ? "✅ Completed" : "⏳ Pending"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Todos;
