import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TaskDetailModal from "../components/TaskDetailModal";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskCard from "../components/TaskCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Loader,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
  CalendarDays,
  Users,
  ListChecks,
  BarChart4,
  X,
  CheckCircle,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

function ProjectDetails() {
  const { user, url } = useUser();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showcreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState({
    status: "",
    priority: "",
    assignedToMe: false,
  });
  const [showFilter, setShowFilter] = useState(false);
  const { showToast } = useToast();

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error("Failed to fetch project details");
      }
      setProject(res.data);
    } catch (err) {
      setError(err.message);
      showToast("Failed to load project details", "error");
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const queryParams = new URLSearchParams();
      if (filter.status) queryParams.append("status", filter.status);
      if (filter.priority) queryParams.append("priority", filter.priority);
      if (filter.assignedToMe) queryParams.append("assignedTo", "true");

      const res = await axios.get(
        `${url}/api/projects/${projectId}?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to fetch tasks");
      }
      setTask(res.data);
    } catch (err) {
      setError(err.message);
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (project) {
      fetchTasks();
    }
  }, [project, filter]);

  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const taskWithStatus = {
        ...taskData,
        status: taskData.status || "Pending",
        projectId: projectId,
      };

      const res = await axios.post(`${url}/api/task`, taskWithStatus, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 201) {
        throw new Error(res.data.error || "Failed to add task");
      }
      fetchTasks();
      setShowCreateModal(false);
      showToast("Task created successfully", "success");
    } catch (err) {
      setError(err.message);
      showToast("Failed to create task", "error");
    }
  };

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      if (!updateData.status && selectedTask) {
        updateData = {
          ...updateData,
          status: selectedTask.status,
        };
      }

      // Add permission check here
      if (
        updateData.status &&
        !user.role === "admin" &&
        selectedTask.assignedTo !== user._id
      ) {
        throw new Error(
          "Only the assigned user or an admin can update task status"
        );
      }

      const token = localStorage.getItem("token");
      const res = await axios.patch(`${url}/api/task/${taskId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200) {
        throw new Error(res.data.error || "Failed to update task");
      }
      fetchTasks();
      setSelectedTask(null);
      showToast("Task updated successfully", "success");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      showToast(
        "Failed to update task: " +
          (err.response?.data?.message || err.message),
        "error"
      );
    }
  };

  const handleTaskComment = async (taskId, comment) => {
    try {
      const token = localStorage.getItem("token");
      const commentData = {
        comment:
          typeof comment === "string"
            ? comment
            : comment.text || comment.content,
        user: user._id,
      };

      const res = await axios.post(
        `${url}/api/task/${taskId}/comment`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 201) {
        throw new Error(res.data.error || "Failed to add comment");
      }

      fetchTasks();

      if (selectedTask && selectedTask._id === taskId) {
        const taskDetails = tasks.find((t) => t._id === taskId);
        if (taskDetails) {
          setSelectedTask(taskDetails);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      showToast("Failed to add comment", "error");
    }
  };

  const clearFilters = () => {
    setFilter({
      status: "",
      priority: "",
      assignedToMe: false,
    });
    showToast("Filters cleared", "info");
  };

  const getTaskStats = () => {
    if (!tasks.length) return { pending: 0, inProgress: 0, done: 0, total: 0 };

    const stats = {
      pending: tasks.filter((t) => t.status === "Pending").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      done: tasks.filter((t) => t.status === "Done").length,
      total: tasks.length,
    };

    return stats;
  };

  const getProjectGradient = () => {
    if (!project || !project._id) return "from-blue-600 to-indigo-700";

    const gradients = [
      "from-blue-600 to-indigo-700",
      "from-emerald-500 to-teal-700",
      "from-purple-600 to-pink-700",
      "from-amber-500 to-orange-700",
      "from-cyan-500 to-blue-700",
      "from-rose-500 to-red-700",
    ];

    const hashNumber = project._id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return gradients[hashNumber % gradients.length];
  };

  const taskStats = getTaskStats();
  const projectGradient = getProjectGradient();

  return (
    <div className="container mx-auto px-4 pb-12">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate("/")}
        className="mt-6 inline-flex items-center px-4 py-2 bg-white shadow-sm hover:shadow-md text-gray-700 border border-gray-200 rounded-lg transition duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </motion.button>

      {loading && !project ? (
        <div className="flex flex-col items-center justify-center py-20 mt-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-12 h-12 text-blue-500 mb-4" />
          </motion.div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      ) : project ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-r ${projectGradient} rounded-2xl p-8 mt-6 mb-8 text-white shadow-lg relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle fill="white" cx="10" cy="10" r="1"></circle>
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots)"></rect>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="bg-white/20 p-2 rounded-lg mr-3"
                    >
                      <Briefcase className="w-6 h-6" />
                    </motion.div>
                    <h1 className="text-3xl font-bold">
                      {project.title || "Untitled Project"}
                    </h1>
                  </div>
                  <p className="text-white/80 max-w-3xl">
                    {project.description || "No description available"}
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hidden md:block">
                  <div className="text-xs uppercase tracking-wider mb-1 text-white/70">
                    Created
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1.5" />
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xs uppercase tracking-wider mb-1 text-white/70">
                    Total Tasks
                  </div>
                  <div className="flex items-center text-xl font-bold">
                    <ListChecks className="w-5 h-5 mr-2" />
                    {taskStats.total}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xs uppercase tracking-wider mb-1 text-white/70">
                    Pending
                  </div>
                  <div className="flex items-center text-xl font-bold">
                    <Clock className="w-5 h-5 mr-2" />
                    {taskStats.pending}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xs uppercase tracking-wider mb-1 text-white/70">
                    In Progress
                  </div>
                  <div className="flex items-center text-xl font-bold">
                    <BarChart4 className="w-5 h-5 mr-2" />
                    {taskStats.inProgress}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xs uppercase tracking-wider mb-1 text-white/70">
                    Completed
                  </div>
                  <div className="flex items-center text-xl font-bold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {taskStats.done}
                  </div>
                </div>
              </div>

              {taskStats.total > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/80">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round((taskStats.done / taskStats.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.round(
                          (taskStats.done / taskStats.total) * 100
                        )}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-2.5 rounded-full bg-white"
                    ></motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <ListChecks className="w-5 h-5 mr-2 text-blue-600" />
              Tasks
              {taskStats.total > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {taskStats.total}
                </span>
              )}
            </h2>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilter(!showFilter)}
                className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm"
              >
                <Filter className="w-4 h-4 mr-1.5" />
                {showFilter ? "Hide Filters" : "Filter Tasks"}
              </motion.button>

              {user?.role === "admin" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className={`text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-md bg-gradient-to-r ${projectGradient}`}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add New Task
                </motion.button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-md mb-6 overflow-hidden border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center text-gray-700">
                    <Filter className="w-4 h-4 mr-1.5 text-blue-600" />
                    Filter Tasks
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear All Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        className="w-full border rounded-lg p-2.5 pr-8 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filter.status}
                        onChange={(e) =>
                          setFilter({ ...filter, status: e.target.value })
                        }
                      >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    {filter.status && (
                      <div className="mt-1.5 text-xs text-blue-600 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Filtering by {filter.status} status
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="priority"
                    >
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        className="w-full border rounded-lg p-2.5 pr-8 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filter.priority}
                        onChange={(e) =>
                          setFilter({ ...filter, priority: e.target.value })
                        }
                      >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    {filter.priority && (
                      <div className="mt-1.5 text-xs text-blue-600 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Filtering by {filter.priority} priority
                      </div>
                    )}
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center cursor-pointer bg-white py-2.5 px-4 rounded-lg border border-gray-200 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        checked={filter.assignedToMe}
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            assignedToMe: e.target.checked,
                          })
                        }
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Assigned to me
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p>
                    <span className="font-medium">Filter tip:</span> Combine
                    multiple filters to narrow down your results. Applied
                    filters will update the task list instantly.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start"
            >
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-12 h-12 text-blue-500 mb-4" />
              </motion.div>
              <p className="text-gray-600">Loading tasks...</p>
              <p className="text-sm text-gray-500 mt-2">
                Please wait while we fetch your tasks
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No tasks found
              </h3>

              {filter.status || filter.priority || filter.assignedToMe ? (
                <div>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    No tasks match your current filters. Try adjusting or
                    removing some filters to see more results.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                user?.role === "admin" && (
                  <div>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      This project doesn't have any tasks yet. Start by creating
                      your first task to track progress and assign work.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateModal(true)}
                      className={`px-5 py-2.5 rounded-lg transition-colors inline-flex items-center shadow-md text-white bg-gradient-to-r ${projectGradient}`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Task
                    </motion.button>
                  </div>
                )
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                  <ListChecks className="w-3.5 h-3.5 mr-1" />
                  {taskStats.total} total
                </div>

                {taskStats.pending > 0 && (
                  <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {taskStats.pending} pending
                  </div>
                )}

                {taskStats.inProgress > 0 && (
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <BarChart4 className="w-3.5 h-3.5 mr-1" />
                    {taskStats.inProgress} in progress
                  </div>
                )}

                {taskStats.done > 0 && (
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    {taskStats.done} completed
                  </div>
                )}

                {(filter.status || filter.priority || filter.assignedToMe) && (
                  <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center ml-auto">
                    <Filter className="w-3.5 h-3.5 mr-1" />
                    Filters applied
                  </div>
                )}
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      show: { y: 0, opacity: 1 },
                    }}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </>
      ) : (
        !loading && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg flex items-start">
            <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold mb-1">Project not found</h3>
              <p>
                The project you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
            </div>
          </div>
        )
      )}

      <AnimatePresence>
        {showcreateModal && (
          <CreateTaskModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTask}
          />
        )}

        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleTaskUpdate}
            onComment={handleTaskComment}
            isAdmin={user?.role === "admin"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectDetails;
