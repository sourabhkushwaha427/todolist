import { useState } from "react";
export default function TaskCard({ task, onDelete, onUpdate, onPatch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [status, setStatus] = useState(task.status || "pending");

  const handleUpdate = () => {
    onUpdate(task._id, { title, description, priority, status });
    setIsEditing(false);
  };

  const handleMarkCompleted = () => {
    if (status !== "completed") {
      setStatus("completed");
      onPatch(task._id, { status: "completed" });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 border-green-400";
      case "medium":
        return "bg-yellow-100 border-yellow-400";
      case "high":
        return "bg-red-100 border-red-400";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div
      className={`border p-4 rounded shadow-md mb-2 flex justify-between items-center ${getPriorityColor(priority || task.priority)}`}
    >
      {isEditing ? (
        <div className="w-full space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
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
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="font-bold">{task.title || "No Title"}</h3>
            <p className="text-sm">{task.description || "No Description"}</p>
            <p className="text-xs text-gray-500">
              Last Updated:{" "}
              {task.updatedAt
                ? new Date(task.updatedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not Updated"}{" "}
              | Priority: {task.priority} | Status: {task.status}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            {task.status !== "completed" && (
              <button
                onClick={handleMarkCompleted}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Done
              </button>
            )}
            <button
              onClick={() => onDelete(task._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
