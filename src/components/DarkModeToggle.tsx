import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "./ThemeContext";

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-4 rounded-full shadow-2xl transition-all duration-500 ${
          darkMode
            ? "bg-yellow-400 text-gray-900"
            : "bg-gray-900 text-yellow-400"
        }`}
      >
        <motion.div
          animate={{ rotate: darkMode ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
