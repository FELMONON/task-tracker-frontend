import { useEffect, useState, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "https://task-tracker-backend-production-567f.up.railway.app/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (!response.ok) throw new Error('Failed to add task');
      
      setNewTaskTitle("");
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error('Failed to update task');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error('Failed to delete task');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-8"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          ✨ Task Tracker
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What's on your mind?"
            aria-label="Task title"
            className="flex-grow px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-sm transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newTaskTitle.trim()}
          >
            Add Task
          </motion.button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <p className="text-lg">No tasks yet. Add one to get started!</p>
          </motion.div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.li
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="group flex items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <motion.input
                      whileTap={{ scale: 0.9 }}
                      type="checkbox"
                      aria-label="Toggle task completion"
                      checked={task.completed}
                      onChange={() => toggleComplete(task._id)}
                      className="w-5 h-5 text-indigo-500 rounded border-gray-300 focus:ring-indigo-400 cursor-pointer"
                    />
                    <span
                      className={`text-lg text-gray-700 transition-all ${
                        task.completed ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTask(task._id)}
                    className="text-red-400 hover:text-red-600 text-xl opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full"
                    aria-label="Delete task"
                  >
                    🗑
                  </motion.button>
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
