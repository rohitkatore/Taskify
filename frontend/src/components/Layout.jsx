import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function Layout() {
  return (
    <div className="min-h-screen relative">
      {/* Background elements */}
      <div className="fixed inset-0 z-[-1]">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white"></div>

        {/* Animated shapes */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
          className="absolute top-[10%] right-[15%] w-[25rem] h-[25rem] rounded-full bg-blue-200/20 blur-3xl"
        />

        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
          className="absolute bottom-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-indigo-300/20 blur-3xl"
        />

        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="absolute top-[30%] left-[25%] w-[20rem] h-[20rem] rounded-full bg-purple-200/20 blur-3xl"
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg width="100%" height="100%">
            <pattern
              id="grid-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%">
            <pattern
              id="dot-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>
      </div>

      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8 max-w-7xl z-10 relative"
      >
        <Outlet />
      </motion.main>

      <footer className="py-4 text-center text-gray-500 text-sm mt-auto relative z-10 bg-white/30 backdrop-blur-sm border-t border-gray-100">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Project Management System</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
