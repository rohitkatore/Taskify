import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Loader,
  FolderOpen,
  LayoutDashboard,
  TrendingUp,
  Clock,
  CheckSquare,
  AlertCircle,
  X,
} from "lucide-react";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid"); // grid or list
  const { url, user } = useUser();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data.error || "Failed to get projects");
      }

      setProjects(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (projectData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${url}/api/projects`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201) {
        throw Error(res.data.errors?.[0] || "Failed to create project");
      }

      fetchProjects();
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter projects based on search term
  const filteredProjects = searchTerm
    ? projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects;

  // Get statistics
  const projectStats = {
    total: projects.length,
    recent: projects.filter(
      (p) =>
        new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    completed: Math.floor(projects.length * 0.4), // Mock data - would be real in production
    inProgress: Math.floor(projects.length * 0.6), // Mock data - would be real in production
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-10"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 shadow-lg"
      >
        {/* Background pattern */}
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
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <LayoutDashboard className="h-7 w-7 mr-3" />
              Projects Dashboard
            </h1>
            <p className="text-blue-100 max-w-2xl">
              Organize, track, and manage all your projects in one place. Create
              new projects, view progress, and collaborate with your team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">
                    Total Projects
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {projectStats.total}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-md">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">
                    Recent Projects
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {projectStats.recent}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-md">
                  <CheckSquare className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">Completed</h3>
                  <p className="text-2xl font-bold text-white">
                    {projectStats.completed}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
            >
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-md">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">
                    In Progress
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {projectStats.inProgress}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Toolbar Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* View options and search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-1 hidden md:flex">
            <button
              onClick={() => setViewType("grid")}
              className={`p-1.5 rounded ${
                viewType === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-1.5 rounded ${
                viewType === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {user?.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md shadow-blue-600/20 btn-effect w-full md:w-auto justify-center"
          >
            <Plus size={18} className="mr-1.5" />
            Create New Project
          </motion.button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-start"
        >
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-sm mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-12 h-12 text-blue-500 mb-4" />
          </motion.div>
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center mb-8"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FolderOpen className="w-10 h-10 text-blue-500" />
          </div>

          {searchTerm ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                No projects match your search
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any projects matching "{searchTerm}". Try
                adjusting your search terms or clear the search.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center"
              >
                <X size={16} className="mr-1.5" />
                Clear search
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                No projects yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Start organizing your work by creating your first project.
                Projects help you group related tasks and collaborate with your
                team.
              </p>
              {user?.role === "admin" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center shadow-lg shadow-blue-600/20"
                >
                  <Plus size={18} className="mr-1.5" />
                  Create Your First Project
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={
            viewType === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredProjects.map((project) => (
            <motion.div key={project._id} variants={item}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateProject}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Dashboard;
