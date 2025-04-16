import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clipboard,
  Clock,
  ArrowRight,
  Users,
  BarChart,
} from "lucide-react";

function ProjectCard({ project }) {
  // Format date
  const formattedDate = new Date(project.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  // Calculate time since creation
  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "just now";
  };

  // Function to get a random gradient for the card header
  const getRandomGradient = () => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-purple-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-cyan-500 to-blue-600",
      "from-rose-500 to-red-600",
      "from-violet-500 to-purple-600",
      "from-lime-500 to-green-600",
    ];

    // Use project id to get a consistent gradient for each project
    const hash = project._id.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return gradients[hash % gradients.length];
  };

  // Get a random progress percentage for the project (in a real app, this would be based on actual tasks)
  const progressPercentage = Math.floor(
    (parseInt(project._id.substring(0, 2), 16) % 100) + 1
  );

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Link
        to={`/projects/${project._id}`}
        className="flex flex-col h-full card-glass rounded-xl overflow-hidden border border-gray-100/70 shadow-md hover:shadow-xl transition-all duration-300 card-hover-effect"
      >
        <div className={`h-3 bg-gradient-to-r ${getRandomGradient()}`}></div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
              {project.title}
            </h3>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-blue-50 p-2.5 rounded-full flex-shrink-0 ml-2"
            >
              <Clipboard size={18} className="text-blue-600" />
            </motion.div>
          </div>

          <p className="text-gray-600 mb-4 flex-grow">
            {project.description.length > 120
              ? project.description.substring(0, 120) + "..."
              : project.description}
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-gray-500 flex items-center">
                <BarChart size={14} className="mr-1" />
                Progress
              </span>
              <span className="text-xs font-medium text-gray-800">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${getRandomGradient()}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full ${
                      i % 2 === 0 ? "bg-blue-500" : "bg-indigo-600"
                    } flex items-center justify-center border-2 border-white text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-gray-500 text-xs font-bold">
                  +2
                </div>
              </div>
              <span className="text-xs text-gray-500 ml-2">Team</span>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span className="whitespace-nowrap">{formattedDate}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-blue-600">
              <span>View Details</span>
              <ArrowRight size={12} className="ml-1" />
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              <Clock size={14} className="mr-1 text-gray-400" />
              <span>{getTimeSince(project.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProjectCard;
