import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Save,
  User,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

function TaskDetailModal({ task, onClose, onUpdate, onComment, isAdmin }) {
  const [status, setStatus] = useState(task.status);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { url, user } = useUser();
  const { showToast } = useToast();

  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
  });

  // Check if current user is assigned to this task
  const isAssignedUser = user && task.assignedTo === user._id;

  // User can update status if they're admin OR the assigned user
  const canUpdateStatus = isAdmin || isAssignedUser;

  useEffect(() => {
    fetchComments();
  }, [task._id]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/api/task/${task._id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setComments(response.data.comments);
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setCommentsError("Failed to load comments");
      showToast("Failed to load comments", "error");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleStatusChange = async () => {
    setSubmitting(true);
    try {
      await onUpdate(task._id, { status });
      showToast(`Task status updated to ${status}`, "success");
    } catch (error) {
      showToast("Failed to update status", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setSubmitting(true);
      try {
        await onComment(task._id, comment);
        setComment("");
        showToast("Comment added successfully", "success");
        // Fetch updated comments after adding a new one
        fetchComments();
      } catch (error) {
        showToast("Failed to add comment", "error");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onUpdate(task._id, editData);
      setEditMode(false);
      showToast("Task updated successfully", "success");
    } catch (error) {
      showToast("Failed to update task", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "Medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modal = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 500 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 overflow-y-auto"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8 relative"
        variants={modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            {editMode ? (
              <>
                <Edit className="mr-2 w-5 h-5 text-blue-600" />
                Edit Task
              </>
            ) : (
              <>
                <div className="mr-2">{getPriorityIcon(task.priority)}</div>
                Task Details
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {editMode ? (
            <motion.form
              key="edit-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleEditSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="edit-title"
                >
                  Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="edit-description"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="edit-priority"
                >
                  Priority
                </label>
                <select
                  id="edit-priority"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                  {task.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-4">
                  <div
                    className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                      task.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : task.priority === "Medium"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {getPriorityIcon(task.priority)}
                    <span className="ml-1">Priority: {task.priority}</span>
                  </div>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-full text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    <span>
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Task
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                  Status
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <select
                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !canUpdateStatus
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!canUpdateStatus}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>

                  {canUpdateStatus ? (
                    <button
                      onClick={handleStatusChange}
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:bg-blue-400"
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        "Update Status"
                      )}
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg flex items-center border border-gray-200">
                      <AlertCircle className="w-4 h-4 mr-1.5" />
                      Only assigned user can update status
                    </div>
                  )}
                </div>

                {!canUpdateStatus && (
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <p>
                      This task is assigned to another user. Only the assigned
                      user or an admin can change its status.
                    </p>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-gray-500" />
                  Comments
                </h4>

                {commentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : commentsError ? (
                  <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-2" />
                    <p>{commentsError}</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No comments yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Be the first to add a comment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    <AnimatePresence>
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </div>
                          </div>
                          <p className="text-gray-800">{comment.comment}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-gray-500" />
                  Add Comment
                </h4>
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Write your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      disabled={!comment.trim() || submitting}
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 mr-1.5" />
                          Add Comment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default TaskDetailModal;
