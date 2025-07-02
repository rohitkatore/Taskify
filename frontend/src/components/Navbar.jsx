import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  LogOut,
  User,
  ChevronDown,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

function Navbar() {
  const { user, Logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = () => {
      if (profileOpen) setProfileOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileOpen]);

  const navAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navAnimation}
      className={`sticky top-0 z-50 shadow-lg ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to={"/"} className="flex items-center">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`p-2 rounded-xl ${
                darkMode ? "bg-indigo-600" : "bg-white/20"
              } mr-3`}
            >
              <CheckSquare className="w-6 h-6" />
            </motion.div>
            <div>
              <motion.h1
                className="text-xl font-bold"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="hidden sm:inline">Taskify</span>
                <span className="sm:hidden">TF</span>
              </motion.h1>
              <motion.div
                className="hidden sm:block text-xs opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.3 }}
              >
                Task • Track • Transform
              </motion.div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="relative px-4 py-2 rounded-lg overflow-hidden group"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative flex items-center">
                    <LayoutDashboard size={18} className="mr-2" />
                    Dashboard
                  </span>
                </Link>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors relative overflow-hidden"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: darkMode ? 0 : 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </motion.div>
                </button>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <motion.button
                    onClick={() => setProfileOpen(!profileOpen)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-1 rounded-full pl-3 pr-2 py-1.5 transition-all border border-white/20 ${
                      profileOpen
                        ? darkMode
                          ? "bg-gray-700"
                          : "bg-blue-500"
                        : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`h-7 w-7 rounded-full flex items-center justify-center mr-1 text-sm font-medium ${
                        darkMode ? "bg-indigo-600" : "bg-white/20"
                      }`}
                    >
                      {user.fullname.charAt(0).toUpperCase()}
                    </motion.div>
                    <span className="max-w-[100px] truncate">
                      {user.fullname.split(" ")[0]}
                    </span>
                    <motion.div
                      animate={{ rotate: profileOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                          duration: 0.2,
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-1 z-10 border ${
                          darkMode
                            ? "bg-gray-800 border-gray-700 text-gray-100"
                            : "bg-white border-gray-100 text-gray-800"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 border-b ${
                            darkMode ? "border-gray-700" : "border-gray-100"
                          }`}
                        >
                          <p className="text-sm font-medium">{user.fullname}</p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            } truncate`}
                          >
                            {user.email}
                          </p>
                          <div
                            className={`mt-2 text-xs py-0.5 px-2 rounded-full inline-block ${
                              darkMode
                                ? "bg-indigo-900/50 text-indigo-200"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role === "admin" ? "Administrator" : "User"}
                          </div>
                        </div>

                        <Link
                          to="/"
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <LayoutDashboard
                            size={16}
                            className={
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }
                          />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="#"
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <Settings
                            size={16}
                            className={
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }
                          />
                          <span>Account Settings</span>
                        </Link>

                        <div
                          className={`my-1 border-t ${
                            darkMode ? "border-gray-700" : "border-gray-100"
                          }`}
                        ></div>

                        <button
                          onClick={Logout}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                            darkMode
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`relative px-4 py-2 rounded-lg overflow-hidden group ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-blue-500/70"
                  } transition-colors`}
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative">Login</span>
                </Link>

                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md transition-colors shadow-sm ${
                    darkMode
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    <User size={16} className="mr-2" />
                    Register
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white p-1 rounded-lg hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <motion.div
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className="md:hidden overflow-hidden mt-3"
            >
              <div
                className={`flex flex-col gap-2 pt-3 pb-3 rounded-xl ${
                  darkMode ? "bg-gray-800" : "bg-white/10"
                }`}
              >
                {user ? (
                  <>
                    <div
                      className={`flex items-center gap-2 px-4 py-3 ${
                        darkMode ? "bg-gray-700/50" : "bg-blue-700/30"
                      } rounded-lg mx-2 mb-2`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`h-10 w-10 rounded-full ${
                          darkMode ? "bg-indigo-600" : "bg-white/20"
                        } flex items-center justify-center text-lg font-bold`}
                      >
                        {user.fullname.charAt(0).toUpperCase()}
                      </motion.div>
                      <div>
                        <p className="font-medium">{user.fullname}</p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-blue-200"
                          } truncate`}
                        >
                          {user.email}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                      </div>
                    </div>

                    <Link
                      to="/"
                      className={`flex items-center gap-2 mx-2 px-4 py-2.5 ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700/30"
                      } rounded-lg transition-colors`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="#"
                      className={`flex items-center gap-2 mx-2 px-4 py-2.5 ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700/30"
                      } rounded-lg transition-colors`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Settings size={18} />
                      <span>Account Settings</span>
                    </Link>

                    <div
                      className={`mx-2 my-1 border-t ${
                        darkMode ? "border-gray-700" : "border-white/10"
                      }`}
                    ></div>

                    <button
                      onClick={() => {
                        Logout();
                        setMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 mx-2 px-4 py-2.5 rounded-lg transition-colors ${
                        darkMode
                          ? "text-red-400 hover:bg-gray-700"
                          : "text-red-200 hover:bg-blue-700/30"
                      }`}
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`flex items-center gap-2 mx-2 px-4 py-3 rounded-lg transition-colors ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700/30"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Login</span>
                    </Link>

                    <Link
                      to="/register"
                      className={`flex items-center gap-2 mx-2 px-4 py-3 rounded-lg transition-colors ${
                        darkMode
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-white/90 text-blue-600 hover:bg-white"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <User
                        size={18}
                        className={darkMode ? "text-white" : "text-blue-600"}
                      />
                      <span>Register</span>
                    </Link>

                    <div className="mx-2 flex justify-end pt-2">
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2 rounded-full ${
                          darkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-blue-700/30"
                        } transition-colors`}
                      >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
