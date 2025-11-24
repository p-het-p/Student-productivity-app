import { User, BookOpen, GraduationCap, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { UserProfile } from "./AccountPage";

interface UserProfileCardProps {
  profile: UserProfile;
  onOpenSettings: () => void;
}

export function UserProfileCard({ profile, onOpenSettings }: UserProfileCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#e43d11] to-[#c73410] rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-xl">
              {profile.name || "Student"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap className="w-4 h-4" />
              <span className="font-['Poppins:Regular',sans-serif] text-white/90 text-sm">
                {profile.grade || "Not set"}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="text-white hover:bg-white/20"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span className="font-['Poppins:Medium',sans-serif] text-sm">
            My Subjects ({profile.subjects.length})
          </span>
        </div>
        
        {profile.subjects.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.subjects.slice(0, 6).map((subject) => (
              <Badge
                key={subject}
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-['Poppins:Regular',sans-serif]"
              >
                {subject}
              </Badge>
            ))}
            {profile.subjects.length > 6 && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 font-['Poppins:Regular',sans-serif]"
              >
                +{profile.subjects.length - 6} more
              </Badge>
            )}
          </div>
        ) : (
          <p className="font-['Poppins:Regular',sans-serif] text-white/70 text-sm">
            No subjects added yet.{" "}
            <button
              onClick={onOpenSettings}
              className="underline hover:text-white"
            >
              Add subjects
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
