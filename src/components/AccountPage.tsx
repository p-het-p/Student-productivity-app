import { useState } from "react";
import { User, BookOpen, GraduationCap, Plus, Trash2, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface UserProfile {
  name: string;
  grade: string;
  subjects: string[];
  email?: string;
}

interface AccountPageProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

const PREDEFINED_SUBJECTS = [
  "Math", "English", "Science", "Physics", "Chemistry", "Biology",
  "History", "Geography", "Computer", "AI", "Hindi", "Social Science",
  "Art", "Music", "Physical Education", "Economics", "Political Science",
  "Psychology", "Business Studies", "Accountancy"
];

const GRADES = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12", "Undergraduate", "Graduate"
];

export function AccountPage({ profile, onUpdateProfile, onClose }: AccountPageProps) {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [newSubject, setNewSubject] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    onClose();
  };

  const handleAddSubject = (subject: string) => {
    if (subject && !editedProfile.subjects.includes(subject)) {
      setEditedProfile({
        ...editedProfile,
        subjects: [...editedProfile.subjects, subject],
      });
      setNewSubject("");
      setIsAddingCustom(false);
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setEditedProfile({
      ...editedProfile,
      subjects: editedProfile.subjects.filter((s) => s !== subject),
    });
  };

  const availableSubjects = PREDEFINED_SUBJECTS.filter(
    (s) => !editedProfile.subjects.includes(s)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e43d11] to-[#c73410] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-2xl">
                  Account Settings
                </h2>
                <p className="font-['Poppins:Regular',sans-serif] text-white/80 text-sm">
                  Manage your profile and subjects
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-['Poppins:SemiBold',sans-serif] flex items-center gap-2">
                <User className="w-5 h-5 text-[#e43d11]" />
                Personal Information
              </CardTitle>
              <CardDescription className="font-['Poppins:Regular',sans-serif]">
                Update your basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-['Poppins:Medium',sans-serif]">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="font-['Poppins:Regular',sans-serif]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="grade" className="font-['Poppins:Medium',sans-serif]">
                  Grade / Class
                </Label>
                <Select
                  value={editedProfile.grade}
                  onValueChange={(value) =>
                    setEditedProfile({ ...editedProfile, grade: value })
                  }
                >
                  <SelectTrigger className="font-['Poppins:Regular',sans-serif]">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem
                        key={grade}
                        value={grade}
                        className="font-['Poppins:Regular',sans-serif]"
                      >
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subjects Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-['Poppins:SemiBold',sans-serif] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#e43d11]" />
                My Subjects
              </CardTitle>
              <CardDescription className="font-['Poppins:Regular',sans-serif]">
                Add or remove subjects you're studying
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Subjects */}
              <div>
                <Label className="font-['Poppins:Medium',sans-serif] mb-3 block">
                  Current Subjects ({editedProfile.subjects.length})
                </Label>
                {editedProfile.subjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.subjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant="outline"
                        className="px-3 py-2 text-sm border-[#e43d11] text-[#e43d11] flex items-center gap-2"
                      >
                        <span className="font-['Poppins:Regular',sans-serif]">
                          {subject}
                        </span>
                        <button
                          onClick={() => handleRemoveSubject(subject)}
                          className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="font-['Poppins:Regular',sans-serif] text-gray-500 text-sm">
                    No subjects added yet. Add subjects below.
                  </p>
                )}
              </div>

              {/* Add Subject */}
              <div className="border-t pt-4">
                <Label className="font-['Poppins:Medium',sans-serif] mb-3 block">
                  Add Subject
                </Label>

                {!isAddingCustom ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {availableSubjects.slice(0, 10).map((subject) => (
                        <Button
                          key={subject}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSubject(subject)}
                          className="font-['Poppins:Regular',sans-serif] hover:bg-[#e43d11] hover:text-white hover:border-[#e43d11]"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {subject}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingCustom(true)}
                      className="font-['Poppins:Regular',sans-serif] text-[#e43d11]"
                    >
                      + Add custom subject
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Enter subject name"
                      className="font-['Poppins:Regular',sans-serif]"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddSubject(newSubject);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAddSubject(newSubject)}
                      className="bg-[#e43d11] hover:bg-[#c73410]"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingCustom(false);
                        setNewSubject("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-gradient-to-br from-[#e43d11]/5 to-[#c73410]/5 border-[#e43d11]/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <GraduationCap className="w-8 h-8 text-[#e43d11] mx-auto mb-2" />
                    <div className="font-['Poppins:SemiBold',sans-serif] text-2xl text-gray-900">
                      {editedProfile.grade || "Not set"}
                    </div>
                    <div className="font-['Poppins:Regular',sans-serif] text-gray-600 text-sm">
                      Your Grade
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <BookOpen className="w-8 h-8 text-[#e43d11] mx-auto mb-2" />
                    <div className="font-['Poppins:SemiBold',sans-serif] text-2xl text-gray-900">
                      {editedProfile.subjects.length}
                    </div>
                    <div className="font-['Poppins:Regular',sans-serif] text-gray-600 text-sm">
                      Subjects
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-['Poppins:Medium',sans-serif]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#e43d11] hover:bg-[#c73410] font-['Poppins:Medium',sans-serif]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}