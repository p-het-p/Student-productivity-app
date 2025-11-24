import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, GraduationCap, Calendar, BookOpen, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTheme } from "./ThemeContext";
import { UserProfile } from "./AccountPage";

interface Subject {
  id: string;
  name: string;
  color: string;
  teacher: string;
}

interface AccountPageRedesignProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

export function AccountPageRedesign({ profile: initialProfile, onUpdateProfile, onClose }: AccountPageRedesignProps) {
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: initialProfile.name || "Student Name",
    email: "student@example.com",
    grade: initialProfile.grade || "10th Grade",
    school: "Central High School",
    joinDate: "September 2024",
  });

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Mathematics", color: "#FFC0CB", teacher: "Mr. Smith" },
    { id: "2", name: "Physics", color: "#B8B8FF", teacher: "Ms. Johnson" },
    { id: "3", name: "Chemistry", color: "#90EE90", teacher: "Dr. Williams" },
    { id: "4", name: "English", color: "#FFB6B6", teacher: "Mrs. Brown" },
    { id: "5", name: "History", color: "#FFFF99", teacher: "Mr. Davis" },
  ]);

  const [newSubject, setNewSubject] = useState({ name: "", teacher: "", color: "#FFC0CB" });
  const [showAddSubject, setShowAddSubject] = useState(false);

  const handleSaveProfile = () => {
    setIsEditing(false);
    onUpdateProfile(profile);
  };

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.teacher) {
      setSubjects([...subjects, { ...newSubject, id: Date.now().toString() }]);
      setNewSubject({ name: "", teacher: "", color: "#FFC0CB" });
      setShowAddSubject(false);
    }
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const colors = ["#FFC0CB", "#B8B8FF", "#90EE90", "#FFB6B6", "#FFFF99", "#DDA0DD", "#87CEEB"];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-[#ece9e2]'} rounded-tl-[57px] rounded-tr-[57px] min-h-screen p-8`}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-['Poppins',sans-serif] font-medium mb-8 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-[#e43d11]'}`}
        >
          Account
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl p-8 transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-['Poppins',sans-serif] font-medium transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Profile Information
              </h2>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-[#e43d11] hover:bg-[#c73410] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e43d11] to-orange-400 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-[#e43d11]">
                    <Edit2 className="w-4 h-4 text-[#e43d11]" />
                  </button>
                )}
              </motion.div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium mb-2 block transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={darkMode ? 'bg-gray-600 text-white border-gray-500' : ''}
                  />
                ) : (
                  <p className={`p-3 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-900'}`}>
                    {profile.name}
                  </p>
                )}
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    type="email"
                    className={darkMode ? 'bg-gray-600 text-white border-gray-500' : ''}
                  />
                ) : (
                  <p className={`p-3 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-900'}`}>
                    {profile.email}
                  </p>
                )}
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Grade/Class
                </label>
                {isEditing ? (
                  <Input
                    value={profile.grade}
                    onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                    className={darkMode ? 'bg-gray-600 text-white border-gray-500' : ''}
                  />
                ) : (
                  <p className={`p-3 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-900'}`}>
                    {profile.grade}
                  </p>
                )}
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  School/Institution
                </label>
                {isEditing ? (
                  <Input
                    value={profile.school}
                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                    className={darkMode ? 'bg-gray-600 text-white border-gray-500' : ''}
                  />
                ) : (
                  <p className={`p-3 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-900'}`}>
                    {profile.school}
                  </p>
                )}
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Member Since
                </label>
                <p className={`p-3 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-900'}`}>
                  {profile.joinDate}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Subjects Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl p-8 transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-['Poppins',sans-serif] font-medium transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                My Subjects
              </h2>
              <Button
                onClick={() => setShowAddSubject(!showAddSubject)}
                className="bg-[#e43d11] hover:bg-[#c73410] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>

            {/* Add Subject Form */}
            {showAddSubject && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`mb-6 p-4 rounded-lg border-2 border-dashed transition-colors duration-500 ${darkMode ? 'border-gray-500 bg-gray-600' : 'border-gray-300 bg-gray-50'}`}
              >
                <div className="space-y-3">
                  <Input
                    placeholder="Subject Name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    className={darkMode ? 'bg-gray-700 text-white border-gray-500' : ''}
                  />
                  <Input
                    placeholder="Teacher Name"
                    value={newSubject.teacher}
                    onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                    className={darkMode ? 'bg-gray-700 text-white border-gray-500' : ''}
                  />
                  <div>
                    <label className={`text-sm font-medium mb-2 block transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Color
                    </label>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewSubject({ ...newSubject, color })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            newSubject.color === color ? 'border-[#e43d11] scale-110' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddSubject}
                      className="bg-[#e43d11] hover:bg-[#c73410] text-white flex-1"
                    >
                      Add
                    </Button>
                    <Button
                      onClick={() => setShowAddSubject(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Subjects List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className={`p-4 rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-50 hover:shadow-md'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div>
                        <h3 className={`font-medium transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {subject.name}
                        </h3>
                        <p className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {subject.teacher}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteSubject(subject.id)}
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className={`mt-6 pt-6 border-t transition-colors duration-500 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-4 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-[#e43d11]">{subjects.length}</div>
                  <div className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total Subjects
                  </div>
                </div>
                <div className={`text-center p-4 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-[#e43d11]">
                    {new Set(subjects.map(s => s.teacher)).size}
                  </div>
                  <div className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Teachers
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-8 rounded-2xl p-8 transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}
        >
          <h2 className={`text-2xl font-['Poppins',sans-serif] font-medium mb-6 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Preferences
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg text-center transition-colors duration-500 ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <div className="text-4xl mb-3">🔔</div>
              <h3 className={`font-medium mb-2 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h3>
              <p className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage your notification settings
              </p>
            </div>
            <div className={`p-6 rounded-lg text-center transition-colors duration-500 ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <div className="text-4xl mb-3">🎨</div>
              <h3 className={`font-medium mb-2 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Theme
              </h3>
              <p className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Customize your experience
              </p>
            </div>
            <div className={`p-6 rounded-lg text-center transition-colors duration-500 ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <div className="text-4xl mb-3">🔒</div>
              <h3 className={`font-medium mb-2 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Privacy
              </h3>
              <p className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Control your data and privacy
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}