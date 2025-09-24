import React from "react";
import { X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const Modal = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40"
          onClick={onClose}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                "inline-block w-full max-w-6xl bg-white rounded-2xl shadow-2xl transform transition-all overflow-hidden",
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Info className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body con más espacio */}
              <div className="px-8 py-6">
                {children}
              </div>
            </motion.div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
