import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Creation form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Inline edit states
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Filter/Sort states
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | alphabetical

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/task");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to retrieve tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  // Add a task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    setError("");
    try {
      const res = await api.post("/task", {
        title: title.trim(),
        description: description.trim(),
      });
      setTasks([res.data, ...tasks]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  // Toggle status (completed vs active)
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "active" : "completed";
    
    // Optimistic UI update
    setTasks(
      tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );

    try {
      await api.put(`/task/${task.id}`, { status: nextStatus });
    } catch (err) {
      setError("Failed to update task status.");
      // Rollback
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter((t) => t.id !== id));

    try {
      await api.delete(`/task/${id}`);
    } catch (err) {
      setError("Failed to delete task.");
      setTasks(originalTasks);
    }
  };

  // Start edit mode
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;

    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, title: editTitle.trim(), description: editDescription.trim() } : t
      )
    );
    setEditingId(null);

    try {
      await api.put(`/task/${id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
    } catch (err) {
      setError("Failed to save changes.");
      fetchTasks(); // Reload from server on error
    }
  };

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const activeCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter, search and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && task.status === "active") ||
        (filter === "completed" && task.status === "completed");
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans relative overflow-hidden pb-12 transition-colors duration-300">
      {/* Background radial glows */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Form & Stats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Stats Card */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl transition-all duration-300">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Dashboard Stats
            </h3>
            
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex items-center justify-center">
                {/* SVG Circular Progress Ring */}
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="34"
                    cx="40"
                    cy="40"
                  />
                  <circle
                    className="text-indigo-550 dark:text-indigo-500 transition-all duration-500 ease-out"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - completionPercentage / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="34"
                    cx="40"
                    cy="40"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-slate-900 dark:text-white">
                  {completionPercentage}%
                </span>
              </div>

              <div className="text-right space-y-1">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount} / {totalCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tasks Completed</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{activeCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
              </div>
              <div className="text-center border-l border-slate-100 dark:border-slate-800/80">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
              </div>
            </div>
          </div>

          {/* Create Task Card */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Task</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="task-title" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Task Title
                </label>
                <input
                  id="task-title"
                  type="text"
                  required
                  placeholder="e.g. Design Landing Page"
                  className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="task-desc" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="task-desc"
                  rows="3"
                  placeholder="Add details about this task..."
                  className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={creating || !title.trim()}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/25 transition-all duration-300 hover:translate-y-[-1px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
              >
                {creating ? (
                  <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Add Task"
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Search, Filter, Task Cards List */}
        <div className="lg:col-span-8 space-y-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-200 text-sm p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0 text-red-650 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
              <button onClick={() => setError("")} className="text-red-605 dark:text-red-400 hover:text-red-750 dark:hover:text-red-200 font-medium">
                Dismiss
              </button>
            </div>
          )}

          {/* Filtering and Searching controls */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg transition-all duration-300">
            
            {/* Filter Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 w-fit">
              {["all", "active", "completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    filter === tab
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-3 flex-1 sm:justify-end">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  className="w-4 h-4 text-slate-450 dark:text-slate-500 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {loading ? (
              // Skeleton Loader Card List
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/40 p-6 rounded-2xl animate-pulse space-y-3"
                >
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
                </div>
              ))
            ) : filteredTasks.length === 0 ? (
              // Empty State view
              <div className="bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/60 p-12 rounded-2xl text-center shadow-lg transition-all duration-300">
                <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800/50 items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">No tasks found</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                  {search || filter !== "all"
                    ? "Adjust your filters or query to find what you're looking for."
                    : "Plan your day and add your first task to get started."}
                </p>
              </div>
            ) : (
              // Task cards display
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white dark:bg-slate-900/40 backdrop-blur-sm border transition-all duration-300 rounded-2xl p-5 shadow-md flex items-start gap-4 ${
                    task.status === "completed"
                      ? "border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/5"
                      : "border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80"
                  }`}
                >
                  
                  {/* Status Toggle Box */}
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`h-6 w-6 rounded-lg flex items-center justify-center border-2 transition-all duration-300 cursor-pointer flex-shrink-0 mt-0.5 ${
                      task.status === "completed"
                        ? "bg-emerald-500 border-emerald-500 text-white dark:text-slate-950"
                        : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400"
                    }`}
                  >
                    {task.status === "completed" && (
                      <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Task details or edit form */}
                  <div className="flex-1 min-w-0">
                    {editingId === task.id ? (
                      // Edit Inputs
                      <div className="space-y-3">
                        <input
                          type="text"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <textarea
                          rows="2"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1 rounded-md transition duration-200 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-md transition duration-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Text Details View
                      <div>
                        <h4
                          className={`font-semibold text-base text-slate-900 dark:text-white tracking-wide truncate transition-all duration-300 ${
                            task.status === "completed" ? "line-through text-slate-450 dark:text-slate-500" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p
                            className={`text-slate-600 dark:text-slate-400 text-sm mt-1 whitespace-pre-line leading-relaxed transition-all duration-300 ${
                              task.status === "completed" ? "line-through text-slate-400 dark:text-slate-650" : ""
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                        
                        {/* Timestamp badge */}
                        <div className="flex items-center space-x-2 mt-3">
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800/80 uppercase">
                            {new Date(task.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Dropdown/Row */}
                  {editingId !== task.id && (
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-1.5 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 rounded-lg transition duration-200 cursor-pointer"
                        title="Edit task"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/10 rounded-lg transition duration-200 cursor-pointer"
                        title="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
