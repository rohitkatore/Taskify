import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

// Create the context
const ToastContext = createContext();

// Define toast types with their styling
const TOAST_TYPES = {
  success: {
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-800",
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-800",
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-800",
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const showToast = (message, type = "success", duration = 5000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

    // Auto-dismiss toast after duration
    if (duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  };

  // Function to dismiss a toast
  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { bgColor, borderColor, textColor, icon } =
              TOAST_TYPES[toast.type] || TOAST_TYPES.info;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded-md shadow-md flex items-start`}
              >
                <div className="flex-shrink-0 mr-3">{icon}</div>
                <div className="flex-1 mr-2">
                  <p className="text-sm font-medium">{toast.message}</p>
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook for using the toast context
export const useToast = () => useContext(ToastContext);
