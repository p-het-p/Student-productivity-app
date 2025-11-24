import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImprovedNavbar } from "./components/ImprovedNavbar";
import { HomeworkSection } from "./components/HomeworkSection";
import { StatsSection } from "./components/StatsSection";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { LandingNavbar } from "./components/LandingNavbar";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { UserProfileCard } from "./components/UserProfileCard";
import { TimetablePageRedesign } from "./components/TimetablePageRedesign";
import { SyllabusPage } from "./components/SyllabusPage";
import { ContactPage } from "./components/ContactPage";
import { AccountPageProfessional } from "./components/AccountPageProfessionalNew";
import { ThemeProvider } from "./components/ThemeContext";
import type { Homework } from "./components/HomeworkTable";
import { AchievementsPage } from "./components/AchievementsPage";
import * as api from "./utils/supabase/client";
import { toast, Toaster } from "sonner@2.0.3";

interface UserProfile {
  name: string;
  grade: string;
  subjects: string[];
  email: string;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState<"landing" | "signin" | "signup">("landing");
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [showAccountPage, setShowAccountPage] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    grade: "",
    subjects: [],
    email: "",
  });

  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  async function checkSession() {
    try {
      const session = await api.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUserData() {
    try {
      // Load profile
      const profileData = await api.getProfile();
      if (profileData.profile) {
        setUserProfile({
          name: profileData.profile.name || "",
          grade: profileData.profile.grade || "",
          subjects: profileData.profile.subjects || [],
          email: profileData.profile.email || "",
        });
      }

      // Load homeworks
      const homeworkData = await api.getHomeworks();
      if (homeworkData.homeworks) {
        setHomeworks(homeworkData.homeworks.map((hw: any) => ({
          id: parseInt(hw.id),
          title: hw.title,
          date: hw.date,
          dueDate: hw.dueDate,
          subject: hw.subject,
          note: hw.note,
          completed: hw.completed || false,
          completedAt: hw.completedAt,
        })));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      await api.signIn(email, password);
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Sign in error:", error);
      alert(`Sign in failed: ${error.message}`);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string, grade: string) => {
    try {
      // Create account on backend
      await api.signUp(email, password, name, grade);
      
      // Sign in the user
      await api.signIn(email, password);
      
      setUserProfile({
        name,
        grade,
        subjects: [],
        email,
      });
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Sign up error:", error);
      alert(`Sign up failed: ${error.message}`);
    }
  };

  const handleGetStarted = () => {
    setAuthView("signup");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = async () => {
    try {
      await api.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
    setIsAuthenticated(false);
    setAuthView("landing");
    setHomeworks([]);
    setUserProfile({ name: "", grade: "", subjects: [], email: "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProfile = async (profile: UserProfile) => {
    try {
      await api.updateProfile({
        name: profile.name,
        grade: profile.grade,
        subjects: profile.subjects,
      });
      setUserProfile(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAddHomework = async (homework: Omit<Homework, "id">) => {
    try {
      const result = await api.createHomework(homework);
      if (result.homework) {
        setHomeworks([...homeworks, {
          id: parseInt(result.homework.id),
          title: result.homework.title,
          date: result.homework.date,
          dueDate: result.homework.dueDate,
          subject: result.homework.subject,
          note: result.homework.note,
          completed: result.homework.completed || false,
          completedAt: result.homework.completedAt,
        }]);
      }
    } catch (error) {
      console.error("Error adding homework:", error);
      alert("Failed to add homework. Please try again.");
    }
  };

  const handleRemoveHomework = async (id: number) => {
    try {
      await api.deleteHomework(id.toString());
      setHomeworks(homeworks.filter((hw) => hw.id !== id));
    } catch (error) {
      console.error("Error removing homework:", error);
      alert("Failed to remove homework. Please try again.");
    }
  };

  const handleDownload = (homework: Homework) => {
    const content = `Homework: ${homework.title}\\nSubject: ${homework.subject}\\nDate: ${homework.date}\\nDue Date: ${homework.dueDate}\\nNote: ${homework.note}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${homework.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const response = await api.updateHomework(id.toString(), { completed });
      
      // Update homework in state
      setHomeworks(homeworks.map(hw => 
        hw.id === id ? { ...hw, completed } : hw
      ));
      
      // Show notification for newly unlocked achievements
      if (response.achievementsUnlocked && response.achievementsUnlocked.length > 0) {
        for (const achievement of response.achievementsUnlocked) {
          toast.success(`🏆 Achievement Unlocked: ${achievement.title}`, {
            description: achievement.description,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling homework completion:", error);
      alert("Failed to update homework. Please try again.");
    }
  };

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e43d11]/5 to-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#e43d11] border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading H-WORK...</p>
        </div>
      </div>
    );
  }

  // Landing Page View
  if (!isAuthenticated) {
    // Show Auth Pages
    if (authView === "signup") {
      return (
        <SignUp
          onSignUp={handleSignUp}
          onSwitchToSignIn={() => setAuthView("signin")}
          onBackToLanding={() => setAuthView("landing")}
        />
      );
    }

    if (authView === "signin") {
      return (
        <SignIn
          onSignIn={handleSignIn}
          onSwitchToSignUp={() => setAuthView("signup")}
          onBackToLanding={() => setAuthView("landing")}
        />
      );
    }

    // Show Landing Page by default
    return (
      <>
        <LandingNavbar onGetStarted={handleGetStarted} />
        <LandingPage onGetStarted={handleGetStarted} />
      </>
    );
  }

  // Main App View
  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavbar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAccount={() => setShowAccountPage(true)}
        onBackToLanding={handleBackToLanding}
      />

      <AnimatePresence mode="wait">
        {currentPage === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* User Profile Card Section */}
            <section className="py-8 bg-gradient-to-b from-white to-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <UserProfileCard 
                  profile={userProfile} 
                  onOpenSettings={() => setShowAccountPage(true)}
                />
              </div>
            </section>

            <StatsSection homeworks={homeworks} />
            <HomeworkSection
              homeworks={homeworks}
              onAdd={handleAddHomework}
              onRemove={handleRemoveHomework}
              onDownload={handleDownload}
              onToggleComplete={handleToggleComplete}
              userSubjects={userProfile.subjects}
            />
          </motion.div>
        )}

        {currentPage === "timetable" && (
          <motion.div
            key="timetable"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TimetablePageRedesign userSubjects={userProfile.subjects} />
          </motion.div>
        )}

        {currentPage === "syllabus" && (
          <motion.div
            key="syllabus"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SyllabusPage userSubjects={userProfile.subjects} />
          </motion.div>
        )}

        {currentPage === "contact" && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ContactPage />
          </motion.div>
        )}

        {currentPage === "achievements" && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AchievementsPage />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer onBackToLanding={handleBackToLanding} onNavigate={handleNavigate} />

      {/* Account Page Modal */}
      {showAccountPage && (
        <AccountPageProfessional
          profile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowAccountPage(false)}
          onLogout={handleBackToLanding}
        />
      )}

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}