import React from 'react';
import { motion } from 'motion/react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const customEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const springConfig = { type: "spring", stiffness: 300, damping: 20 };

export const PageTransition: React.FC<Props> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: customEasing }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
