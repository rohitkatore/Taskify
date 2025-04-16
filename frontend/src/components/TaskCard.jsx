import React from "react";
import { motion } from "framer-motion";
import { Clock, Tag, AlertCircle, CheckCircle, Activity } from "lucide-react";

function TaskCard({ task, onClick }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border-red-200";
      case "Medium":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "Low":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-50 text-green-600 border-green-200";
      case "In Progress":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Pending":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <CheckCircle size={14} className="mr-1" />;
      case "In Progress":
        return <Activity size={14} className="mr-1" />;
      case "Pending":
        return <Clock size={14} className="mr-1" />;
      default:
        return <Clock size={14} className="mr-1" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <AlertCircle size={14} className="mr-1" />;
      case "Medium":
        return <Tag size={14} className="mr-1" />;
      case "Low":
        return <Tag size={14} className="mr-1" />;
      default:
        return <Tag size={14} className="mr-1" />;
    }
  };

  const priorityClass = getPriorityColor(task.priority);
  const statusClass = getStatusColor(task.status);
  const statusIcon = getStatusIcon(task.status);
  const priorityIcon = getPriorityIcon(task.priority);

  // Format date in a readable format
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card-glass rounded-xl shadow-sm border border-gray-100/70 overflow-hidden transition-all duration-300 cursor-pointer card-hover-effect"
    >
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {task.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 h-12 mb-3">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${priorityClass} flex items-center`}
          >
            {priorityIcon}
            {task.priority}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full border ${statusClass} flex items-center`}
          >
            {statusIcon}
            {task.status}
          </span>
        </div>

        <div className="text-xs text-gray-500 flex items-center justify-end mt-2 border-t border-gray-50 pt-2">
          <Clock size={14} className="mr-1.5" />
          {formatDate(task.createdAt)}
        </div>
      </div>
      <div
        className={`h-1 ${
          task.status === "Done"
            ? "bg-green-500"
            : task.status === "In Progress"
            ? "bg-blue-500"
            : "bg-gray-300"
        }`}
      ></div>
    </motion.div>
  );
}

export default TaskCard;
