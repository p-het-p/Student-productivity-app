import img2147690478RemovebgPreviewUpscayl4XUpscaylStandard4X1 from "figma:asset/973ddc70ae4ed03fe95e5332483022c375c64973.png";
import { ArrowRight, Sparkles, Target, TrendingUp, BookOpen, CheckCircle, Users, Zap, Heart, Star, Rocket, Smile, Coffee, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useState } from "react";
import { useTheme } from "./ThemeContext";
import { DarkModeToggle } from "./DarkModeToggle";
import { 
  BookIcon, 
  TargetIcon, 
  StarIcon, 
  RocketIcon, 
  LightbulbIcon, 
  PaletteIcon, 
  TrophyIcon, 
  CelebrationIcon, 
  SparklesIcon, 
  GlowingStarIcon, 
  BalloonIcon, 
  HeartIcon, 
  PeaceIcon,
  SuccessIcon,
  GoalIcon
} from "./icons/CustomIcons";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [hoveredEmoji, setHoveredEmoji] = useState<number | null>(null);
  const { darkMode, toggleDarkMode } = useTheme();
  
  const features = [
    {
      icon: Sparkles,
      title: "Stay Organized",
      description: "Keep all your homework, assignments, and tasks in one centralized place.",
    },
    {
      icon: Target,
      title: "Never Miss Deadlines",
      description: "Get smart reminders and status updates for all your upcoming work.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your productivity and see how you're improving over time.",
    },
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: "All-in-One Platform",
      description: "Homework, timetables, and syllabus organized in one place.",
    },
    {
      icon: CheckCircle,
      title: "100% Free Forever",
      description: "Secure and private platform created by students, for students.",
    },
    {
      icon: Users,
      title: "Student-Friendly",
      description: "Designed specifically for students' needs and workflows.",
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Simple interface that anyone can use without training.",
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Dark Mode Toggle Button */}
      <DarkModeToggle />

      {/* Hero Section */}
      <section id="home" className={`relative overflow-hidden transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          {/* Floating Geometric Shapes */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 right-10 w-16 h-16 border-4 border-[#e43d11]/20 rounded-lg hidden lg:block"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              rotate: [0, -90, -180],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-32 left-10 w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 opacity-20 rounded-full hidden lg:block"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 right-1/4 w-8 h-8 border-2 border-purple-500/30 hidden lg:block"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="flex flex-wrap gap-3">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 bg-[#e43d11] text-white px-4 py-2 rounded-full shadow-lg"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  <span className="font-medium text-sm">
                    Secure & Private Platform
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </motion.div>
                  <span className="font-medium text-sm">
                    100% Free Forever
                  </span>
                </motion.div>
              </div>

              <h1 className={`font-['Space_Grotesk',sans-serif] leading-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="block text-4xl md:text-5xl lg:text-6xl"
                >
                  Plan your work
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block text-3xl md:text-4xl lg:text-5xl mt-2"
                >
                  download for{" "}
                  <span className="relative inline-block text-[#e43d11]">
                    <span className="relative z-10">free</span>
                    <motion.span 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="absolute bottom-2 left-0 h-3 bg-[#e43d11] opacity-20 -rotate-1" 
                    />
                  </span>
                </motion.span>
              </h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-lg leading-relaxed max-w-xl transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                A secure platform to make students productive about
                their work. Organize homework, timetables, and syllabus with complete privacy.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  onClick={onGetStarted}
                  className="bg-[#e43d11] hover:bg-[#c73410] text-white px-8 py-6 group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <span className="font-medium relative z-10">
                    Get Started
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 group"
                >
                  <span className="font-medium">
                    Learn More
                  </span>
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="cursor-pointer"
                >
                  <motion.div 
                    className="font-['Space_Grotesk',sans-serif] text-[#e43d11] text-2xl md:text-3xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  >
                    100%
                  </motion.div>
                  <div className="text-gray-600 text-sm">
                    Free
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="cursor-pointer"
                >
                  <div className="font-['Space_Grotesk',sans-serif] text-[#e43d11] text-2xl md:text-3xl flex items-center gap-2">
                    Secure
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      🔒
                    </motion.span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    & Private
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="cursor-pointer"
                >
                  <div className="font-['Space_Grotesk',sans-serif] text-[#e43d11] text-2xl md:text-3xl flex items-center gap-2">
                    Easy
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
                    >
                      ⚡
                    </motion.span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    To Use
                  </div>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-xs">👤</span>
                    </motion.div>
                  ))}
                </div>
                <motion.p 
                  className="text-gray-600 text-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="font-medium text-gray-900">Join students</span> organizing their homework better
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              {/* Floating Icons Around Image */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-3 z-20 border-2 border-[#e43d11]/20"
              >
                <BookIcon className="w-8 h-8 text-[#e43d11]" />
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -10, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-3 z-20 border-2 border-green-500/20"
              >
                <TargetIcon className="w-8 h-8 text-green-500" />
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, 15, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-3 z-20 border-2 border-purple-500/20"
              >
                <RocketIcon className="w-8 h-8 text-purple-500" />
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-3 z-20 border-2 border-yellow-500/20"
              >
                <TrophyIcon className="w-8 h-8 text-yellow-500" />
              </motion.div>

              <div className="relative z-10" style={{ perspective: "1000px" }}>
                {/* 3D Floating Cards Stack */}
                <div className="relative w-full h-[500px] flex items-center justify-center">
                  {/* Card 1 - Back */}
                  <motion.div
                    initial={{ rotateY: -15, rotateX: 10, z: -100 }}
                    animate={{ 
                      rotateY: [-15, -12, -15],
                      rotateX: [10, 12, 10],
                      z: [-100, -80, -100],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="absolute w-80 h-96 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl shadow-2xl"
                  >
                    <div className="p-8 h-full flex flex-col justify-between text-white">
                      <div>
                        <BookIcon className="w-12 h-12 mb-4" />
                        <h3 className="font-['Space_Grotesk',sans-serif] text-2xl mb-2">Homework</h3>
                        <p className="text-purple-100 text-sm">Track all your assignments</p>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="h-2 bg-white/40 rounded w-3/4 mb-1"></div>
                          <div className="h-2 bg-white/30 rounded w-1/2"></div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="h-2 bg-white/40 rounded w-2/3 mb-1"></div>
                          <div className="h-2 bg-white/30 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 2 - Middle */}
                  <motion.div
                    initial={{ rotateY: 0, rotateX: 5, z: 0 }}
                    animate={{ 
                      rotateY: [0, 3, 0],
                      rotateX: [5, 8, 5],
                      z: [0, 20, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="absolute w-80 h-96 bg-gradient-to-br from-[#e43d11] to-orange-600 rounded-3xl shadow-2xl"
                  >
                    <div className="p-8 h-full flex flex-col justify-between text-white">
                      <div>
                        <TargetIcon className="w-12 h-12 mb-4" />
                        <h3 className="font-['Space_Grotesk',sans-serif] text-2xl mb-2">Timetable</h3>
                        <p className="text-orange-100 text-sm">Plan your schedule</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="bg-white/20 rounded-lg p-2 text-center">
                            <div className="text-xs font-medium">Day {i}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 3 - Front */}
                  <motion.div
                    initial={{ rotateY: 15, rotateX: -5, z: 100 }}
                    animate={{ 
                      rotateY: [15, 12, 15],
                      rotateX: [-5, -8, -5],
                      z: [100, 120, 100],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="absolute w-80 h-96 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl shadow-2xl"
                  >
                    <div className="p-8 h-full flex flex-col justify-between text-white">
                      <div>
                        <TrophyIcon className="w-12 h-12 mb-4" />
                        <h3 className="font-['Space_Grotesk',sans-serif] text-2xl mb-2">Progress</h3>
                        <p className="text-green-100 text-sm">Track your achievements</p>
                      </div>
                      <div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Completed</span>
                            <span>75%</span>
                          </div>
                          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "75%" }}
                              transition={{ duration: 2, delay: 1.5 }}
                              className="h-full bg-white rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/20 rounded-lg p-2">
                            <div className="text-xl font-bold">24</div>
                            <div className="text-xs">Done</div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-2">
                            <div className="text-xl font-bold">8</div>
                            <div className="text-xs">Active</div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-2">
                            <div className="text-xl font-bold">3</div>
                            <div className="text-xs">Due</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Icon Elements */}
                  <motion.div
                    animate={{
                      y: [0, -30, 0],
                      rotateZ: [0, 360],
                      z: [0, 150, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-10 -right-10 bg-white rounded-2xl shadow-xl p-4"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <RocketIcon className="w-10 h-10 text-[#e43d11]" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, 25, 0],
                      rotateZ: [0, -360],
                      z: [0, -150, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute -bottom-10 -left-10 bg-white rounded-2xl shadow-xl p-4"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <LightbulbIcon className="w-10 h-10 text-yellow-500" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotateZ: [0, 180],
                      z: [0, 100, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                    className="absolute top-1/2 -right-16 bg-white rounded-2xl shadow-xl p-4"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <StarIcon className="w-10 h-10 text-purple-500" />
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#e43d11]/10 to-transparent rounded-full blur-3xl -z-10" />
              
              {/* Animated Rings */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-4 border-[#e43d11] rounded-full -z-10"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.05, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border-2 border-purple-500 rounded-full -z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`font-['Space_Grotesk',sans-serif] text-3xl md:text-4xl mb-4 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose H-WORK?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to stay on top of your academic work
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`rounded-2xl p-8 shadow-sm border transition-all duration-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 hover:shadow-2xl hover:border-[#e43d11]' 
                      : 'bg-white border-gray-200 hover:shadow-xl'
                  }`}
                >
                  <div className="bg-[#e43d11]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[#e43d11]" />
                  </div>
                  <h3 className={`font-['Space_Grotesk',sans-serif] text-xl mb-3 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className={`py-20 transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-gray-800 to-gray-900' 
          : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-[#e43d11]/10 rounded-full p-4"
              >
                <Sparkles className="w-12 h-12 text-[#e43d11]" />
              </motion.div>
            </div>
            <h2 className={`font-['Space_Grotesk',sans-serif] text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight transition-colors duration-500 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Learning gets easier
              <br />
              <span className="text-[#e43d11]">when everything is organized.</span>
            </h2>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-xl p-6 shadow-sm border transition-all duration-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 hover:shadow-2xl hover:border-[#e43d11]' 
                      : 'bg-white border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="bg-[#e43d11]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#e43d11]" />
                  </div>
                  <h3 className={`font-['Space_Grotesk',sans-serif] mb-2 transition-colors duration-500 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#e43d11] to-[#c73410] rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl"
          >
            <h3 className="font-['Space_Grotesk',sans-serif] text-2xl md:text-4xl mb-4">
              Ready to boost your productivity?
            </h3>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join students who are already organizing their academic life better
              with H-WORK. It's free, secure, and easy to use.
            </p>
            <Button
              onClick={onGetStarted}
              className="bg-white text-[#e43d11] font-medium px-10 py-6 text-lg rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
            >
              Start Organizing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-20 transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`font-['Space_Grotesk',sans-serif] text-3xl md:text-4xl mb-4 transition-colors duration-500 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              How It Works
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className={`rounded-2xl p-8 shadow-lg border-2 transition-all h-full duration-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 hover:border-[#e43d11]' 
                  : 'bg-white border-gray-200 hover:border-[#e43d11]'
              }`}>
                <div className="absolute -top-4 -left-4 bg-[#e43d11] text-white w-12 h-12 rounded-full flex items-center justify-center font-['Space_Grotesk',sans-serif] text-xl shadow-lg">
                  1
                </div>
                <h3 className={`font-['Space_Grotesk',sans-serif] text-xl mb-3 mt-2 transition-colors duration-500 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Create Your Account
                </h3>
                <p className={`transition-colors duration-500 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Set up your profile with your name, grade, and subjects you're studying.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className={`rounded-2xl p-8 shadow-lg border-2 transition-all h-full duration-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 hover:border-[#e43d11]' 
                  : 'bg-white border-gray-200 hover:border-[#e43d11]'
              }`}>
                <div className="absolute -top-4 -left-4 bg-[#e43d11] text-white w-12 h-12 rounded-full flex items-center justify-center font-['Space_Grotesk',sans-serif] text-xl shadow-lg">
                  2
                </div>
                <h3 className={`font-['Space_Grotesk',sans-serif] text-xl mb-3 mt-2 transition-colors duration-500 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Add Your Homework
                </h3>
                <p className={`transition-colors duration-500 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Quickly add homework assignments with due dates, subjects, and notes.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className={`rounded-2xl p-8 shadow-lg border-2 transition-all h-full duration-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 hover:border-[#e43d11]' 
                  : 'bg-white border-gray-200 hover:border-[#e43d11]'
              }`}>
                <div className="absolute -top-4 -left-4 bg-[#e43d11] text-white w-12 h-12 rounded-full flex items-center justify-center font-['Space_Grotesk',sans-serif] text-xl shadow-lg">
                  3
                </div>
                <h3 className={`font-['Space_Grotesk',sans-serif] text-xl mb-3 mt-2 transition-colors duration-500 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Stay Organized
                </h3>
                <p className={`transition-colors duration-500 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Track your progress, filter by status, and never miss a deadline again.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              onClick={onGetStarted}
              variant="outline"
              className="border-2 border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white px-8 py-6"
            >
              <span className="font-medium">
                Try It Now
              </span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Fun Playful Footer Section */}
      <section className="py-16 bg-gradient-to-br from-[#e43d11] via-orange-500 to-pink-500 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Fun Emoji Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="font-['Space_Grotesk',sans-serif] text-white text-3xl md:text-4xl mb-6">
              Made with love for students! 
            </h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Because studying should be fun, organized, and stress-free!
            </p>
          </motion.div>

          {/* Interactive Icon Garden */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-12">
            {[
              { Icon: BookIcon, label: "Study" },
              { Icon: GoalIcon, label: "Goals" },
              { Icon: SuccessIcon, label: "Success" },
              { Icon: RocketIcon, label: "Launch" },
              { Icon: LightbulbIcon, label: "Ideas" },
              { Icon: PaletteIcon, label: "Creative" },
              { Icon: TrophyIcon, label: "Winner" },
              { Icon: CelebrationIcon, label: "Party" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.3, 
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
                onHoverStart={() => setHoveredEmoji(index)}
                onHoverEnd={() => setHoveredEmoji(null)}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-all"
              >
                <motion.div 
                  className="mb-2 text-white"
                  animate={hoveredEmoji === index ? {
                    y: [0, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <item.Icon className="w-10 h-10" />
                </motion.div>
                <span className="text-white text-xs font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Fun Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: Heart, count: "100%", label: "Made with Love" },
              { icon: Star, count: "Free", label: "Forever" },
              { icon: Rocket, count: "Fast", label: "& Easy" },
              { icon: Smile, count: "Fun", label: "Learning" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-white/20 hover:border-white/40 transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block mb-3"
                >
                  <stat.icon className="w-8 h-8 text-white mx-auto" />
                </motion.div>
                <div className="font-['Space_Grotesk',sans-serif] text-white text-2xl mb-1">
                  {stat.count}
                </div>
                <div className="text-white/80 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Playful CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onGetStarted}
                className="bg-white text-[#e43d11] hover:bg-gray-100 px-12 py-8 text-xl font-['Space_Grotesk',sans-serif] shadow-2xl group"
              >
                <span className="mr-3">Let's Get Started!</span>
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block"
                >
                  <CelebrationIcon className="w-6 h-6 inline" />
                </motion.span>
              </Button>
            </motion.div>
            
            {/* Fun Message */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/90 mt-8 text-lg flex items-center justify-center gap-2"
            >
              <span>Join the homework revolution!</span>
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="inline-block"
              >
                <PeaceIcon className="w-6 h-6" />
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 text-white hidden lg:block"
          >
            <SparklesIcon className="w-16 h-16" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-10 right-10 text-white hidden lg:block"
          >
            <GlowingStarIcon className="w-16 h-16" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-1/2 left-20 text-white hidden lg:block"
          >
            <BalloonIcon className="w-14 h-14" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}