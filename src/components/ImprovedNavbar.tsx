import { motion } from "motion/react";
import { BookOpen, Calendar, FileText, Home, Mail, User, Menu, X, Trophy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeContext";

interface ImprovedNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAccount: () => void;
  onBackToLanding: () => void;
}

export function ImprovedNavbar({ currentPage, onNavigate, onOpenAccount, onBackToLanding }: ImprovedNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode } = useTheme();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
        darkMode 
          ? "bg-gray-900/80 border-gray-700" 
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 cursor-pointer"
            onClick={onBackToLanding}
          >
            <h1 className="font-['Space_Grotesk',sans-serif] text-[#e43d11] text-2xl tracking-tight">
              H-WORK
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "text-[#e43d11]"
                      : darkMode
                      ? "text-gray-300 hover:text-[#e43d11] hover:bg-gray-800"
                      : "text-gray-600 hover:text-[#e43d11] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e43d11]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Account Button */}
          <div className="hidden md:block">
            <Button
              onClick={onOpenAccount}
              variant="outline"
              className="border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-colors ${
                darkMode 
                  ? "text-gray-300 hover:text-[#e43d11]" 
                  : "text-gray-600 hover:text-[#e43d11]"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`md:hidden border-t transition-colors duration-500 ${
            darkMode 
              ? "border-gray-700 bg-gray-900" 
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#e43d11] text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <Button
              onClick={() => {
                onOpenAccount();
                setIsMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}