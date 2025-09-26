import React from "react";
import { X, Info, Maximize2, Users, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const Modal = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Fondo con efecto glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-md"
          />

          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                "inline-block w-full max-w-7xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl border border-white/20 transform transition-all overflow-hidden relative backdrop-blur-md",
                className
              )}
            >
              {/* Efecto de borde luminoso */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 pointer-events-none" />

              {/* Header compacto */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Gestión de Públicos - Electrónicos</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={onClose}
                    className="group p-2 rounded-lg bg-white/60 hover:bg-red-50 border border-white/30 shadow-sm hover:shadow transition-all hover:border-red-200"
                  >
                    <X className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>

              {/* 🔥 CONTENIDO CON SCROLL INTERNO */}
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar"> {/* Altura limitada con scroll */}
                <div className="p-6 bg-white/40">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;