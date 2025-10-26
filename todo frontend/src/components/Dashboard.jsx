import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import TaskCard from "./TaskCard";
export default function Dashboard() {
  const [tasks, setTasks] = useState([]); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_URL}/api/tasks?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();   
      if (data.tasks) {
        setTasks(data.tasks);
        setTotalPages(data.totalPages || 1);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [page]); 

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, priority }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      setTitle("");
      setDescription("");
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error("Failed to update task");
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePatchTask = async (id, partialData) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(partialData),
      });
      if (!res.ok) throw new Error("Failed to patch task");
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">My Tasks</h2>
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>

      {loading && <p className="text-gray-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div> 
        {tasks.length > 0 ? (  
          tasks.map((task) => (
            
            <TaskCard
              key={task.task_id || task._id}
              task={task}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onPatch={handlePatchTask}
            />
          ))
        ) : (
          !loading && <p className="text-center text-gray-600">No tasks found.</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
