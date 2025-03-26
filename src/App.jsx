import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "https://task-tracker-backend-production-567f.up.railway.app/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle }),
    });

    setNewTaskTitle("");
    fetchTasks();
  };

  const toggleComplete = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
      method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">🌟 Task Tracker</h1>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What's on your mind?"
            aria-label="Task title"
            className="flex-grow px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            Add
          </button>
        </form>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.li
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      aria-label="Toggle task completion"
                      checked={task.completed}
                      onChange={() => toggleComplete(task._id)}
                      className="w-5 h-5 text-indigo-500"
                    />
                    <span
                      className={`text-lg text-gray-700 ${task.completed ? "line-through opacity-60" : ""}`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-700 text-xl"
                    aria-label="Delete task"
                  >
                    🗑
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default App;
