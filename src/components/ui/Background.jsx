import { motion } from "framer-motion";

const Background = () => {
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-50 overflow-hidden bg-[#101318]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[20px_20px] sm:bg-size-[30px_30px] lg:bg-size-[40px_40px]" />
      <motion.div
        animate={{ x: [0, 200, 0], y: [0, -150, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/3 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-cyan-500/10 rounded-full blur-[60px] sm:blur-[90px] lg:blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -200, 0], y: [0, 150, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-44 h-44 sm:w-60 sm:h-60 lg:w-92 lg:h-92 bg-emerald-500/10 rounded-full blur-[60px] sm:blur-[90px] lg:blur-[120px]"
      />
    </motion.div>
  );
};

export default Background;