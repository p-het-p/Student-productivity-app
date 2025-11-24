import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeContext";
import {
  Award,
  Flame,
  Trophy,
  Clock,
  TrendingUp,
  GraduationCap,
  Target,
  Calendar,
  Zap,
  RotateCcw,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  date?: string;
  progress?: number;
  total?: number;
  category: "completion" | "streak" | "efficiency" | "milestone";
}

export function AchievementsPage() {
  const { darkMode } = useTheme();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Helper function to map icon strings to icon components
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Award,
      Flame,
      Trophy,
      Clock,
      TrendingUp,
      GraduationCap,
      Target,
      Calendar,
      Zap,
      RotateCcw,
    };
    return iconMap[iconName] || Trophy;
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const session = JSON.parse(localStorage.getItem("supabase_session") || "{}");
      const accessToken = session.access_token;

      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/achievements`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.achievements) {
          const formattedAchievements = data.achievements.map((ach: any) => ({
            id: ach.id,
            title: ach.title,
            description: ach.description,
            icon: getIconComponent(ach.icon),
            unlocked: ach.unlocked,
            date: ach.date,
            progress: ach.progress || 0,
            total: ach.total || 1,
            category: ach.category || "milestone",
          }));

          setAchievements(formattedAchievements);
        }
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "completion":
        return Target;
      case "streak":
        return Flame;
      case "efficiency":
        return Zap;
      case "milestone":
        return Trophy;
      default:
        return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "completion":
        return "text-blue-500";
      case "streak":
        return "text-orange-500";
      case "efficiency":
        return "text-yellow-500";
      case "milestone":
        return "text-purple-500";
      default:
        return "text-[#e43d11]";
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const filteredAchievements =
    filterCategory === "all"
      ? achievements
      : achievements.filter((a) => a.category === filterCategory);

  const categories = [
    { id: "all", label: "All Achievements", icon: Award },
    { id: "completion", label: "Completion", icon: Target },
    { id: "streak", label: "Streaks", icon: Flame },
    { id: "efficiency", label: "Efficiency", icon: Zap },
    { id: "milestone", label: "Milestones", icon: Trophy },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`transition-colors duration-500 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#e43d11] to-orange-600 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1
                  className={`text-4xl font-bold transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Achievements
                </h1>
                <p
                  className={`transition-colors duration-500 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Track your progress and unlock rewards
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm transition-colors duration-500 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Overall Progress
                </span>
                <span
                  className={`text-sm font-bold transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {unlockedCount} / {totalCount} Unlocked
                </span>
              </div>
              <div
                className={`h-3 rounded-full overflow-hidden transition-colors duration-500 ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#e43d11] to-orange-500 rounded-full"
                />
              </div>
              <p
                className={`text-xs mt-1 transition-colors duration-500 ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {completionPercentage.toFixed(0)}% Complete
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              const isActive = filterCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    isActive
                      ? "bg-[#e43d11] text-white shadow-lg shadow-[#e43d11]/25"
                      : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <CategoryIcon className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                  {category.id !== "all" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {achievements.filter((a) => a.category === category.id && a.unlocked).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#e43d11] animate-spin" />
          </div>
        ) : (
          <>
            {/* Achievements Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredAchievements.map((achievement, index) => {
                  const AchievementIcon = achievement.icon;
                  const CategoryIcon = getCategoryIcon(achievement.category);
                  const isExpanded = expandedAchievement === achievement.id;
                  const progressPercentage = achievement.total
                    ? (achievement.progress! / achievement.total) * 100
                    : 0;

                  return (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                        achievement.unlocked
                          ? darkMode
                            ? "bg-gradient-to-br from-gray-800 to-gray-750 border-2 border-[#e43d11]/50 shadow-xl shadow-[#e43d11]/10"
                            : "bg-gradient-to-br from-white to-orange-50 border-2 border-[#e43d11]/30 shadow-xl shadow-[#e43d11]/10"
                          : darkMode
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              achievement.unlocked
                                ? "bg-gradient-to-br from-[#e43d11] to-orange-600 shadow-lg shadow-[#e43d11]/30"
                                : darkMode
                                ? "bg-gray-700"
                                : "bg-gray-100"
                            }`}
                          >
                            {achievement.unlocked ? (
                              <AchievementIcon className="w-8 h-8 text-white" />
                            ) : (
                              <Lock className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <CategoryIcon
                              className={`w-5 h-5 ${getCategoryColor(achievement.category)}`}
                            />
                            {achievement.unlocked && (
                              <div className="flex items-center gap-1">
                                <Unlock className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-green-500 font-medium">
                                  Unlocked
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3
                          className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                            achievement.unlocked
                              ? darkMode
                                ? "text-white"
                                : "text-gray-900"
                              : darkMode
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-sm mb-4 transition-colors duration-500 ${
                            achievement.unlocked
                              ? darkMode
                                ? "text-gray-300"
                                : "text-gray-700"
                              : darkMode
                              ? "text-gray-600"
                              : "text-gray-500"
                          }`}
                        >
                          {achievement.description}
                        </p>

                        {/* How to Unlock (for locked achievements) */}
                        {!achievement.unlocked && (
                          <div
                            className={`mb-4 p-3 rounded-lg transition-colors duration-500 ${
                              darkMode ? "bg-gray-700/50" : "bg-orange-50"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Target
                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                  darkMode ? "text-[#e43d11]" : "text-[#e43d11]"
                                }`}
                              />
                              <div className="flex-1">
                                <p
                                  className={`text-xs font-semibold mb-1 transition-colors duration-500 ${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  How to Unlock:
                                </p>
                                <p
                                  className={`text-xs transition-colors duration-500 ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {achievement.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Progress Bar (for locked achievements) */}
                        {!achievement.unlocked && achievement.total && achievement.total > 1 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-xs transition-colors duration-500 ${
                                  darkMode ? "text-gray-500" : "text-gray-500"
                                }`}
                              >
                                Progress
                              </span>
                              <span
                                className={`text-xs font-bold transition-colors duration-500 ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {achievement.progress} / {achievement.total}
                              </span>
                            </div>
                            <div
                              className={`h-2 rounded-full overflow-hidden transition-colors duration-500 ${
                                darkMode ? "bg-gray-700" : "bg-gray-200"
                              }`}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-[#e43d11] to-orange-500 rounded-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Unlock Date */}
                        {achievement.unlocked && achievement.date && (
                          <div
                            className={`flex items-center gap-2 text-xs mb-4 transition-colors duration-500 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>
                              Unlocked on {new Date(achievement.date).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Expand Button */}
                        <button
                          onClick={() =>
                            setExpandedAchievement(isExpanded ? null : achievement.id)
                          }
                          className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {isExpanded ? "Show Less" : "Show Details"}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div
                                className={`mt-4 pt-4 border-t transition-colors duration-500 ${
                                  darkMode ? "border-gray-700" : "border-gray-200"
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`text-sm transition-colors duration-500 ${
                                        darkMode ? "text-gray-400" : "text-gray-600"
                                      }`}
                                    >
                                      Category
                                    </span>
                                    <span
                                      className={`text-sm font-medium capitalize transition-colors duration-500 ${
                                        darkMode ? "text-gray-300" : "text-gray-700"
                                      }`}
                                    >
                                      {achievement.category}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`text-sm transition-colors duration-500 ${
                                        darkMode ? "text-gray-400" : "text-gray-600"
                                      }`}
                                    >
                                      Status
                                    </span>
                                    <span
                                      className={`text-sm font-medium ${
                                        achievement.unlocked
                                          ? "text-green-500"
                                          : darkMode
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {achievement.unlocked ? "Unlocked" : "Locked"}
                                    </span>
                                  </div>
                                  {achievement.unlocked && achievement.date && (
                                    <div className="flex items-center justify-between">
                                      <span
                                        className={`text-sm transition-colors duration-500 ${
                                          darkMode ? "text-gray-400" : "text-gray-600"
                                        }`}
                                      >
                                        Unlock Date
                                      </span>
                                      <span
                                        className={`text-sm font-medium transition-colors duration-500 ${
                                          darkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                      >
                                        {new Date(achievement.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredAchievements.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center py-20 rounded-2xl transition-colors duration-500 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <Award
                  className={`w-16 h-16 mx-auto mb-4 transition-colors duration-500 ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No Achievements Yet
                </h3>
                <p
                  className={`transition-colors duration-500 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Complete homework to unlock achievements!
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
