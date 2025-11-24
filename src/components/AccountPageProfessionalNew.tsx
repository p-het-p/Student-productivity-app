import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  BookOpen,
  Settings,
  Bell,
  Lock,
  Palette,
  Trophy,
  Target,
  X,
  Upload,
  Camera,
  Save,
  Edit3,
  CheckCircle2,
  BarChart3,
  Clock,
  Award,
  Flame,
  TrendingUp,
  Shield,
  Eye,
  Download,
  Trash2,
  Plus,
  ChevronRight,
  LogOut,
  Loader2,
  Zap,
  RotateCcw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useTheme } from "./ThemeContext";
import { UserProfile } from "./AccountPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { projectId } from "../utils/supabase/info";

interface AccountPageProfessionalProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onLogout?: () => void;
}

interface SubjectData {
  id: string;
  name: string;
  grade: string;
  attendance: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  date?: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: "homework" | "timetable" | "syllabus" | "account";
}

export function AccountPageProfessional({
  profile: initialProfile,
  onUpdateProfile,
  onClose,
  onLogout,
}: AccountPageProfessionalProps) {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: initialProfile.name || "Student Name",
    email: initialProfile.email || "student@example.com",
    grade: initialProfile.grade || "10th Grade",
    school: "Central High School",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "2008-05-15",
    address: "123 Education Street, Knowledge City",
    bio: "Passionate student focused on academic excellence and personal growth.",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    deadlineReminders: true,
    weeklyReport: true,
    soundEffects: false,
    autoSave: true,
    darkMode: darkMode,
    language: "English",
    timezone: "GMT-5",
  });

  // Subjects state management - Start with empty array
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    grade: "A",
    attendance: 100,
  });

  const GRADE_OPTIONS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F", "N/A"];
  
  // Activity state
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Load subjects from database
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
        const accessToken = session.access_token;
        
        if (!accessToken) {
          setLoadingSubjects(false);
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/profile`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const profileSubjects = data.profile?.subjects || [];
          
          // Convert subject data to SubjectData format
          const formattedSubjects = profileSubjects.map((subject: any, index: number) => ({
            id: subject.id || `${Date.now()}-${index}`,
            name: typeof subject === 'string' ? subject : subject.name,
            grade: typeof subject === 'string' ? 'N/A' : (subject.grade || 'N/A'),
            attendance: typeof subject === 'string' ? 0 : (subject.attendance || 0),
          }));
          
          setSubjects(formattedSubjects);
        }
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  // Load activities from database
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
        const accessToken = session.access_token;
        
        if (!accessToken) {
          setLoadingActivity(false);
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/activities`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const activities = data.activities || [];
          
          // Format activities with relative time
          const formattedActivities = activities.map((activity: any) => ({
            id: activity.id,
            action: activity.action,
            timestamp: getRelativeTime(activity.timestamp),
            type: activity.type,
          }));
          
          setRecentActivity(formattedActivities);
        }
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoadingActivity(false);
      }
    };

    loadActivities();
  }, []);

  // Helper function to format relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return then.toLocaleDateString();
  };

  // Log activity helper
  const logActivity = async (action: string, type: string) => {
    try {
      const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
      const accessToken = session.access_token;
      
      if (!accessToken) return;

      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/activities`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action, type }),
        }
      );
      
      // Reload activities after logging
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/activities`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const activities = data.activities || [];
        const formattedActivities = activities.map((activity: any) => ({
          id: activity.id,
          action: activity.action,
          timestamp: getRelativeTime(activity.timestamp),
          type: activity.type,
        }));
        setRecentActivity(formattedActivities);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormData({ name: "", grade: "A", attendance: 100 });
    setShowAddSubjectDialog(true);
  };

  const handleEditSubject = (subject: SubjectData) => {
    setEditingSubject(subject);
    setSubjectFormData({
      name: subject.name,
      grade: subject.grade,
      attendance: subject.attendance,
    });
    setShowAddSubjectDialog(true);
  };

  const handleSaveSubject = async () => {
    if (!subjectFormData.name.trim()) {
      alert("Please enter a subject name");
      return;
    }

    let updatedSubjects: SubjectData[];

    if (editingSubject) {
      // Update existing subject
      updatedSubjects = subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...s, ...subjectFormData }
          : s
      );
    } else {
      // Add new subject
      const newSubject: SubjectData = {
        id: Date.now().toString(),
        ...subjectFormData,
      };
      updatedSubjects = [...subjects, newSubject];
    }

    setSubjects(updatedSubjects);

    // Save to database
    try {
      const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
      const accessToken = session.access_token;
      
      if (accessToken) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/subjects`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjects: updatedSubjects }),
          }
        );

        // Update profile
        onUpdateProfile({
          ...initialProfile,
          subjects: updatedSubjects.map(s => s.name),
        });

        // Log activity
        await logActivity(
          editingSubject 
            ? `Updated subject: ${subjectFormData.name}` 
            : `Added new subject: ${subjectFormData.name}`,
          "account"
        );
      }
    } catch (error) {
      console.error('Error saving subject:', error);
    }

    setShowAddSubjectDialog(false);
    setSubjectFormData({ name: "", grade: "A", attendance: 100 });
  };

  const handleDeleteSubject = async (subjectId: string) => {
    const subjectToDelete = subjects.find(s => s.id === subjectId);
    if (!subjectToDelete) return;

    if (confirm(`Are you sure you want to delete ${subjectToDelete.name}?`)) {
      const updatedSubjects = subjects.filter(s => s.id !== subjectId);
      setSubjects(updatedSubjects);
      
      // Save to database
      try {
        const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
        const accessToken = session.access_token;
        
        if (accessToken) {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/subjects`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ subjects: updatedSubjects }),
            }
          );

          // Update profile
          onUpdateProfile({
            ...initialProfile,
            subjects: updatedSubjects.map(s => s.name),
          });

          // Log activity
          await logActivity(`Deleted subject: ${subjectToDelete.name}`, "account");
        }
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalHomework: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    streak: 0,
    averageGrade: "-",
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Helper function to map icon strings to icon components
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Award, Flame, Trophy, Clock, TrendingUp, GraduationCap, Target, Calendar, Zap, RotateCcw,
    };
    return iconMap[iconName] || Trophy;
  };

  // Load achievements from database
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
        const accessToken = session.access_token;
        
        if (!accessToken) {
          setLoadingAchievements(false);
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/achievements`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const achievementsList = data.achievements || [];
          
          // Format achievements with icon components
          const formattedAchievements = achievementsList.map((ach: any) => ({
            id: ach.id,
            title: ach.title,
            description: ach.description,
            icon: getIconComponent(ach.icon),
            unlocked: ach.unlocked,
            date: ach.date,
          }));
          
          setAchievements(formattedAchievements);
        }
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoadingAchievements(false);
      }
    };

    loadAchievements();
  }, [activeTab]); // Reload when tab changes

  // Load homework stats from database
  useEffect(() => {
    const loadStats = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
        const accessToken = session.access_token;
        
        if (!accessToken) {
          setLoadingStats(false);
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20/homeworks`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const homeworks = data.homeworks || [];
          
          // Calculate stats
          const totalHomework = homeworks.length;
          const completed = homeworks.filter((hw: any) => hw.completed === true).length;
          
          // Calculate pending and overdue
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          let pending = 0;
          let overdue = 0;
          
          homeworks.forEach((hw: any) => {
            if (!hw.completed && hw.dueDate) {
              // Parse dueDate in DD/MM/YYYY format
              const [day, month, year] = hw.dueDate.split('/').map(Number);
              const dueDate = new Date(year, month - 1, day);
              dueDate.setHours(0, 0, 0, 0);
              
              if (dueDate < today) {
                overdue++;
              } else {
                pending++;
              }
            }
          });
          
          // Calculate streak
          const completedHomeworks = homeworks
            .filter((hw: any) => hw.completed && hw.completedAt)
            .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
          
          let currentStreak = 0;
          let lastCompletionDate: Date | null = null;
          
          for (const hw of completedHomeworks) {
            const completionDate = new Date(hw.completedAt);
            completionDate.setHours(0, 0, 0, 0);
            
            if (!lastCompletionDate) {
              currentStreak = 1;
              lastCompletionDate = completionDate;
            } else {
              const daysDiff = (lastCompletionDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24);
              
              if (daysDiff === 1) {
                currentStreak++;
                lastCompletionDate = completionDate;
              } else if (daysDiff > 1) {
                break;
              }
            }
          }
          
          setStats({
            totalHomework,
            completed,
            pending,
            overdue,
            streak: currentStreak,
            averageGrade: "-", // Grade system not implemented yet
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [activeTab]); // Reload when tab changes

  const handleSaveProfile = async () => {
    onUpdateProfile({
      name: profileData.name,
      grade: profileData.grade,
      subjects: initialProfile.subjects,
    });
    setIsEditingProfile(false);

    // Log activity
    await logActivity("Updated profile information", "account");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "homework":
        return BookOpen;
      case "timetable":
        return Calendar;
      case "syllabus":
        return Target;
      case "account":
        return Settings;
      default:
        return CheckCircle2;
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    // Save original body overflow
    const originalOverflow = document.body.style.overflow;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restore scroll on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl transition-colors duration-500 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`px-8 py-6 border-b transition-colors duration-500 ${
            darkMode ? "border-gray-800 bg-gray-800/50" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-['Space_Grotesk',sans-serif] transition-colors duration-500 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Account Settings
              </h1>
              <p
                className={`mt-1 transition-colors duration-500 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Manage your profile, preferences, and account security
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-8">
            <TabsList
              className={`grid w-full grid-cols-5 mb-8 p-1 rounded-xl ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-[#e43d11] data-[state=active]:text-white"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="academics"
                className="flex items-center gap-2 data-[state=active]:bg-[#e43d11] data-[state=active]:text-white"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Academics</span>
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2 data-[state=active]:bg-[#e43d11] data-[state=active]:text-white"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Achievements</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-[#e43d11] data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="flex items-center gap-2 data-[state=active]:bg-[#e43d11] data-[state=active]:text-white"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab - keeping existing implementation */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Picture Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-6 text-center transition-colors duration-500 ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e43d11] to-orange-400 flex items-center justify-center text-white text-4xl font-bold">
                      {profileData.name.charAt(0).toUpperCase()}
                    </div>
                    <button
                      className="absolute bottom-0 right-0 bg-[#e43d11] text-white p-3 rounded-full shadow-lg hover:bg-[#c73410] transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-1 transition-colors duration-500 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {profileData.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 transition-colors duration-500 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {profileData.email}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </motion.div>

                {/* Profile Information Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`lg:col-span-2 rounded-2xl p-6 transition-colors duration-500 ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className={`text-xl font-semibold transition-colors duration-500 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Personal Information
                    </h3>
                    {!isEditingProfile ? (
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        variant="outline"
                        size="sm"
                        className="border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProfile}
                          size="sm"
                          className="bg-[#e43d11] hover:bg-[#c73410]"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setIsEditingProfile(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Full Name
                      </Label>
                      {isEditingProfile ? (
                        <Input
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                          }
                          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                        />
                      ) : (
                        <p
                          className={`p-3 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                          }`}
                        >
                          {profileData.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email Address
                      </Label>
                      {isEditingProfile ? (
                        <Input
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                          }
                          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                        />
                      ) : (
                        <p
                          className={`p-3 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                          }`}
                        >
                          {profileData.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Grade/Class
                      </Label>
                      {isEditingProfile ? (
                        <Input
                          value={profileData.grade}
                          onChange={(e) =>
                            setProfileData({ ...profileData, grade: e.target.value })
                          }
                          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                        />
                      ) : (
                        <p
                          className={`p-3 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                          }`}
                        >
                          {profileData.grade}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Phone Number
                      </Label>
                      {isEditingProfile ? (
                        <Input
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({ ...profileData, phone: e.target.value })
                          }
                          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                          placeholder="e.g., +1 (555) 123-4567"
                        />
                      ) : (
                        <p
                          className={`p-3 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                          }`}
                        >
                          {profileData.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        School/Institution
                      </Label>
                      {isEditingProfile ? (
                        <Input
                          value={profileData.school}
                          onChange={(e) =>
                            setProfileData({ ...profileData, school: e.target.value })
                          }
                          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                          placeholder="e.g., Central High School"
                        />
                      ) : (
                        <p
                          className={`p-3 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                          }`}
                        >
                          {profileData.school}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Date of Birth
                      </Label>
                      {isEditingProfile ? (
                        <Input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) =>
                            setProfileData({ ...profileData, dateOfBirth: e.target.value })
                          }
                          className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                        />
                      ) : (
                        <p
                          className={`p-3 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                          }`}
                        >
                          {new Date(profileData.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Bio
                      </Label>
                      {isEditingProfile ? (
                        <textarea
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({ ...profileData, bio: e.target.value })
                          }
                          rows={3}
                          className={`w-full p-3 rounded-lg border transition-colors duration-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p
                          className={`p-3 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                          }`}
                        >
                          {profileData.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {loadingStats ? (
                  // Loading state
                  [1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl text-center transition-colors duration-500 ${
                        darkMode ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    >
                      <Loader2 className="w-8 h-8 text-[#e43d11] mx-auto mb-3 animate-spin" />
                      <div className={`text-sm transition-colors duration-500 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Loading...
                      </div>
                    </div>
                  ))
                ) : (
                  [
                    { label: "Total Homework", value: stats.totalHomework, icon: BookOpen },
                    { label: "Completed", value: stats.completed, icon: CheckCircle2 },
                    { label: "Current Streak", value: `${stats.streak} days`, icon: Flame },
                    { label: "Average Grade", value: stats.averageGrade, icon: Trophy },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl text-center transition-colors duration-500 ${
                        darkMode ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    >
                      <stat.icon className="w-8 h-8 text-[#e43d11] mx-auto mb-3" />
                      <div
                        className={`text-3xl font-bold mb-1 transition-colors duration-500 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stat.value}
                      </div>
                      <div
                        className={`text-sm transition-colors duration-500 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </TabsContent>

            {/* Academics Tab */}
            <TabsContent value="academics" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 transition-colors duration-500 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3
                      className={`text-xl font-semibold transition-colors duration-500 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Subject Performance
                    </h3>
                    <p
                      className={`text-sm mt-1 transition-colors duration-500 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Add subjects with grades and attendance tracking
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#e43d11] hover:bg-[#c73410]"
                    onClick={handleAddSubject}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
                </div>

                {loadingSubjects ? (
                  <div className={`text-center py-12 transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" />
                    <p>Loading subjects...</p>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className={`text-center py-12 transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">No subjects added yet</p>
                    <p className="text-sm mb-4">Click "Add Subject" to track your academic performance</p>
                    <div className={`text-xs mt-6 p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                      <p className="font-semibold mb-2">Example subject fields:</p>
                      <ul className="text-left space-y-1">
                        <li>• Subject Name: e.g., "Mathematics", "Physics", "English"</li>
                        <li>• Grade: A+, A, B+, B, etc.</li>
                        <li>• Attendance: 0-100%</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subjects.map((subject, index) => (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl transition-all duration-500 group ${
                          darkMode ? "bg-gray-700 hover:bg-gray-650" : "bg-white hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#e43d11] to-orange-400 flex items-center justify-center text-white font-bold">
                              {subject.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-medium transition-colors duration-500 ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {subject.name}
                              </h4>
                              <p
                                className={`text-sm transition-colors duration-500 ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Attendance: {subject.attendance}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#e43d11]">
                                {subject.grade}
                              </div>
                              <div
                                className={`text-xs transition-colors duration-500 ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Current Grade
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditSubject(subject)}
                                className="border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteSubject(subject.id)}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Achievements Tab - keeping existing */}
            <TabsContent value="achievements" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 transition-colors duration-500 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-6 transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your Achievements
                </h3>

                {loadingAchievements ? (
                  <div className={`text-center py-12 transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" />
                    <p>Loading achievements...</p>
                  </div>
                ) : achievements.length === 0 ? (
                  <div className={`text-center py-12 transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No achievements yet</p>
                    <p className="text-sm mt-2">Complete homework to unlock achievements!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-6 rounded-xl relative overflow-hidden transition-all duration-500 ${
                        achievement.unlocked
                          ? darkMode
                            ? "bg-gradient-to-br from-gray-700 to-gray-600"
                            : "bg-gradient-to-br from-orange-50 to-red-50"
                          : darkMode
                          ? "bg-gray-700/50"
                          : "bg-gray-100"
                      } ${achievement.unlocked ? "border-2 border-[#e43d11]" : ""}`}
                    >
                      {achievement.unlocked && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-5 h-5 text-[#e43d11]" />
                        </div>
                      )}
                      <achievement.icon
                        className={`w-12 h-12 mb-4 ${
                          achievement.unlocked ? "text-[#e43d11]" : "text-gray-400"
                        }`}
                      />
                      <h4
                        className={`font-semibold mb-2 transition-colors duration-500 ${
                          achievement.unlocked
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {achievement.title}
                      </h4>
                      <p
                        className={`text-sm mb-2 transition-colors duration-500 ${
                          achievement.unlocked
                            ? darkMode
                              ? "text-gray-300"
                              : "text-gray-700"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.date && (
                        <p
                          className={`text-xs transition-colors duration-500 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Unlocked: {achievement.date}
                        </p>
                      )}
                    </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Settings Tab - keeping existing */}
            <TabsContent value="settings" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 transition-colors duration-500 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-6 transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Bell className="w-5 h-5 inline mr-2" />
                  Notifications
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      description: "Receive updates via email",
                    },
                    {
                      key: "pushNotifications",
                      label: "Push Notifications",
                      description: "Get browser notifications",
                    },
                    {
                      key: "deadlineReminders",
                      label: "Deadline Reminders",
                      description: "Remind me before homework is due",
                    },
                    {
                      key: "weeklyReport",
                      label: "Weekly Reports",
                      description: "Send weekly progress summary",
                    },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-500 ${
                        darkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <div>
                        <h4
                          className={`font-medium transition-colors duration-500 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {setting.label}
                        </h4>
                        <p
                          className={`text-sm transition-colors duration-500 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {setting.description}
                        </p>
                      </div>
                      <Switch
                        checked={settings[setting.key as keyof typeof settings] as boolean}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, [setting.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl p-6 transition-colors duration-500 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-6 transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Shield className="w-5 h-5 inline mr-2" />
                  Privacy & Security
                </h3>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  
                  {/* Logout Button */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (onLogout) {
                          onLogout();
                          onClose();
                        }
                      }}
                      className={`w-full justify-start transition-all duration-300 ${
                        darkMode
                          ? "text-[#e43d11] hover:bg-[#e43d11]/10 hover:border-[#e43d11] border-gray-600"
                          : "text-[#e43d11] hover:bg-[#e43d11]/10 hover:border-[#e43d11]"
                      }`}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>

                  {/* Delete Account - Kept separate at bottom */}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Activity Tab - NEW with real data from database */}
            <TabsContent value="activity" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 transition-colors duration-500 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-6 transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Recent Activity
                </h3>

                {loadingActivity ? (
                  <div className={`text-center py-12 transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" />
                    <p>Loading activity...</p>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className={`text-center py-12 transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">No recent activity</p>
                    <p className="text-sm">Your actions will appear here as you use the app</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-start gap-4 p-4 rounded-lg transition-colors duration-500 ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-[#e43d11]/10">
                            <Icon className="w-5 h-5 text-[#e43d11]" />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`transition-colors duration-500 ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {activity.action}
                            </p>
                            <p
                              className={`text-sm transition-colors duration-500 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {activity.timestamp}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add/Edit Subject Dialog */}
        <AnimatePresence>
          {showAddSubjectDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4`}
              onClick={() => setShowAddSubjectDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md rounded-3xl shadow-2xl transition-colors duration-500 ${
                  darkMode ? "bg-gray-900" : "bg-white"
                }`}
              >
                {/* Header */}
                <div
                  className={`px-6 py-4 border-b transition-colors duration-500 ${
                    darkMode ? "border-gray-800 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-xl font-['Space_Grotesk',sans-serif] transition-colors duration-500 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingSubject ? "Edit Subject" : "Add Subject"}
                    </h2>
                    <button
                      onClick={() => setShowAddSubjectDialog(false)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                          : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <Label
                      className={`text-sm mb-2 block transition-colors duration-500 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Subject Name
                    </Label>
                    <Input
                      value={subjectFormData.name}
                      onChange={(e) =>
                        setSubjectFormData({ ...subjectFormData, name: e.target.value })
                      }
                      className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      placeholder="e.g., Mathematics, Physics, English"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Grade
                      </Label>
                      <select
                        value={subjectFormData.grade}
                        onChange={(e) =>
                          setSubjectFormData({ ...subjectFormData, grade: e.target.value })
                        }
                        className={`w-full p-3 rounded-lg border transition-colors duration-500 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        {GRADE_OPTIONS.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label
                        className={`text-sm mb-2 block transition-colors duration-500 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Attendance (%)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={subjectFormData.attendance}
                        onChange={(e) =>
                          setSubjectFormData({ ...subjectFormData, attendance: parseInt(e.target.value) || 0 })
                        }
                        className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                        placeholder="0-100"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddSubjectDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSubject}
                      className="bg-[#e43d11] hover:bg-[#c73410]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
