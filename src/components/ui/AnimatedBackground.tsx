import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <>
      {/* Gradient Orbs */}
      <div className="animated-gradient-bg" aria-hidden="true">
        <motion.div
          className="gradient-orb gradient-orb-1"
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -40, 20, 30, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="gradient-orb gradient-orb-2"
          animate={{
            x: [0, -30, 40, -20, 0],
            y: [0, 30, -20, 40, 0],
            scale: [1, 0.95, 1.05, 0.98, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="gradient-orb gradient-orb-3"
          animate={{
            x: [0, 20, -30, 10, 0],
            y: [0, -20, 30, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="mesh-overlay" aria-hidden="true" />

      {/* Noise Texture */}
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
}
