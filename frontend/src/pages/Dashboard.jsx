import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { Plus, Search, CheckCircle, Clock, ListTodo, CheckSquare } from "lucide-react";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | active | completed
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/task");
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateOrUpdate = async (taskData) => {
        try {
            if (editingTask) {
                const res = await api.put(`/task/${editingTask.id}`, taskData);
                setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? res.data : t)));
            } else {
                const res = await api.post("/task", taskData);
                setTasks((prev) => [res.data, ...prev]);
            }
        } catch (err) {
            console.error("Error saving task", err);
        }
    };

    const handleToggleStatus = async (task) => {
        const newStatus = task.status === "completed" ? "active" : "completed";
        try {
            const res = await api.put(`/task/${task.id}`, { status: newStatus });
            setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
        } catch (err) {
            console.error("Error updating task status", err);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/task/${id}`);
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error("Error deleting task", err);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

        const matchesFilter =
            filter === "all" ? true : task.status === filter;

        return matchesSearch && matchesFilter;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const activeTasks = tasks.filter((t) => t.status === "active").length;

    return (
        <div className="min-h-screen pb-16 transition-colors">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-9">
                    <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-md flex items-center gap-4 shadow-sm">
                        <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                            <ListTodo size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Tasks</p>
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalTasks}</h3>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-md flex items-center gap-4 shadow-sm">
                        <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">In Progress</p>
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeTasks}</h3>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-md flex items-center gap-4 shadow-sm">
                        <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Completed</p>
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{completedTasks}</h3>
                        </div>
                    </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                    <div className="flex flex-1 flex-col sm:flex-row w-full sm:w-auto gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition text-sm shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex p-1 gap-1 rounded-xl bg-slate-200/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 w-fit">
                            {["all", "active", "completed"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${filter === tab
                                            ? "bg-indigo-600 text-white shadow"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* New Task Button */}
                    <button
                        onClick={handleOpenCreateModal}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition cursor-pointer"
                    >
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>
                </div>

                {/* Task Cards Grid */}
                {loading ? (
                    <div className="text-center py-20 text-slate-400">
                        <p className="animate-pulse">Loading tasks...</p>
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggleStatus={handleToggleStatus}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 mt-4">
                        <CheckSquare size={44} className="mx-auto text-slate-400 dark:text-slate-600 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">No tasks found</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {search || filter !== "all"
                                ? "Try adjusting your search terms or filter selection."
                                : "Create your first task to start organizing your work!"}
                        </p>
                    </div>
                )}
            </main>

            {/* Modal */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleCreateOrUpdate}
                initialData={editingTask}
            />
        </div>
    );
}
