import { CheckCircle2, Circle, Edit3, Trash2, Calendar } from "lucide-react";

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
    const isCompleted = task.status === "completed";
    const formattedDate = new Date(task.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });

    return (
        <div
            className={`relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 backdrop-blur-md shadow-md hover:shadow-xl ${isCompleted
                    ? "bg-slate-100/80 dark:bg-slate-900/60 border-emerald-500/30 border-l-4 border-l-emerald-500 opacity-80"
                    : "bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10 border-l-4 border-l-indigo-500"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <button
                    onClick={() => onToggleStatus(task)}
                    className={`p-1 transition-colors cursor-pointer ${isCompleted
                            ? "text-emerald-500 dark:text-emerald-400 hover:text-emerald-600"
                            : "text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        }`}
                    title={isCompleted ? "Mark as active" : "Mark as completed"}
                >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                <div className="flex-1">
                    <h3
                        className={`font-semibold text-base leading-snug mb-1 ${isCompleted ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
                            }`}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {task.description}
                        </p>
                    )}
                </div>

                <span
                    className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${isCompleted
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                        }`}
                >
                    {task.status}
                </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-3 mt-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                    <Calendar size={13} />
                    <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition cursor-pointer"
                        title="Edit Task"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:text-rose-300 transition cursor-pointer"
                        title="Delete Task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
