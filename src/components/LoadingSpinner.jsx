import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-96">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0
          }}
        />
        <motion.div
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.2
          }}
        />
        <motion.div
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.4
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
