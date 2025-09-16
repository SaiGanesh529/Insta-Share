import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function EachTodo() {
  const { id } = useParams();
  const [Todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/Todos/${id}`);
        const data = await res.json();
        setTodo(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading user...</p>;
  }

  if (!Todo || !Todo.id) {
    return <p className="text-center text-red-500 mt-10">Todo not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back button */}
      <Link
        to="/Todos"
        className="inline-block mb-4 text-indigo-500 hover:text-indigo-700 font-medium"
      >
        ← Back to Users
      </Link>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-3xl font-bold mb-4">
          {Todo.userId}
        </div>

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-3xl font-bold mb-4">
          {Todo.title}
        </div>


      </div>
    </div>
  );
}

export default EachTodo;
