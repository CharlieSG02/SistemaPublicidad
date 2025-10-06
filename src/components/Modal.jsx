import { X, Info, Maximize2, Users, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const Modal = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0 }}>
          {/* Fondo oscuro con efecto glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0, width: '100vw', height: '100vh' }}
            onClick={onClose}
          />

          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                "inline-block w-full max-w-7xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-gray-700/50 transform transition-all overflow-hidden relative backdrop-blur-md",
                className
              )}
            >
              {/* Efecto de borde luminoso */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

              {/* Header compacto */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={onClose}
                    className="group p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 shadow-sm hover:shadow-lg transition-all hover:scale-110"
                  >
                    <X className="h-4 w-4 text-red-400 group-hover:text-red-300 transition-colors" />
                  </button>
                </div>
              </div>

              {/* CONTENIDO CON SCROLL INTERNO */}
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="p-6 bg-gray-900/50">
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