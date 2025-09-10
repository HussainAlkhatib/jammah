'use client'

import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 -z-10 h-full w-full bg-background"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1, transition: { duration: 5 } }}
    >
      <motion.div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), hsl(var(--background) / 0.8) 70.71%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, hsl(var(--accent) / 0.1), hsl(var(--background) / 0.8) 70.71%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 5,
        }}
      />
    </motion.div>
  )
}
