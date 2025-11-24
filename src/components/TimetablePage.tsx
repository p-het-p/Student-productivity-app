import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Plus, Trash2, Clock, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface TimetableEntry {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher?: string;
  room?: string;
}

interface TimetablePageProps {
  userSubjects: string[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STORAGE_KEY = "hwork_timetable";

export function TimetablePage({ userSubjects }: TimetablePageProps) {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved timetable", e);
      }
    }
    return [];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    day: "Monday",
    startTime: "",
    endTime: "",
    subject: "",
    teacher: "",
    room: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timetable));
  }, [timetable]);

  const handleAddEntry = () => {
    if (newEntry.startTime && newEntry.endTime && newEntry.subject) {
      setTimetable([
        ...timetable,
        {
          id: Date.now(),
          ...newEntry,
        },
      ]);
      setNewEntry({
        day: "Monday",
        startTime: "",
        endTime: "",
        subject: "",
        teacher: "",
        room: "",
      });
      setIsDialogOpen(false);
    }
  };

  const handleRemoveEntry = (id: number) => {
    setTimetable(timetable.filter((entry) => entry.id !== id));
  };

  const getTimetableByDay = (day: string) => {
    return timetable
      .filter((entry) => entry.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-['Space_Grotesk',sans-serif] text-4xl text-gray-900 mb-2">
                Timetable
              </h1>
              <p className="text-gray-600">Manage your class schedule</p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#e43d11] hover:bg-[#c73410] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </motion.div>

        {/* Timetable Grid */}
        <div className="grid gap-6">
          {DAYS.map((day, dayIndex) => {
            const dayEntries = getTimetableByDay(day);
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-gradient-to-r from-[#e43d11] to-[#c73410] px-6 py-4">
                  <h3 className="font-['Space_Grotesk',sans-serif] text-white text-xl">
                    {day}
                  </h3>
                </div>
                <div className="p-6">
                  {dayEntries.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No classes scheduled</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {dayEntries.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#e43d11] transition-all group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 text-[#e43d11]">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {entry.startTime} - {entry.endTime}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveEntry(entry.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{entry.subject}</span>
                            </div>
                            {entry.teacher && (
                              <p className="text-sm text-gray-600">Teacher: {entry.teacher}</p>
                            )}
                            {entry.room && (
                              <p className="text-sm text-gray-500">Room: {entry.room}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Class to Timetable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Day</Label>
              <Select value={newEntry.day} onValueChange={(value) => setNewEntry({ ...newEntry, day: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={newEntry.subject} onValueChange={(value) => setNewEntry({ ...newEntry, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {userSubjects.length > 0 ? (
                    userSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="General">General</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Teacher (optional)</Label>
              <Input
                value={newEntry.teacher}
                onChange={(e) => setNewEntry({ ...newEntry, teacher: e.target.value })}
                placeholder="Teacher name"
              />
            </div>
            <div>
              <Label>Room (optional)</Label>
              <Input
                value={newEntry.room}
                onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                placeholder="Room number"
              />
            </div>
            <Button
              onClick={handleAddEntry}
              className="w-full bg-[#e43d11] hover:bg-[#c73410] text-white"
            >
              Add to Timetable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
