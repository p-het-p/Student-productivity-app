import { useState } from "react";
import { Plus, Calendar, BookOpen, ClipboardList, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTheme } from "./ThemeContext";
import type { Homework } from "./HomeworkTable";

interface AddHomeworkDialogProps {
  onAdd: (homework: Omit<Homework, "id">) => void;
  userSubjects?: string[];
}

export function AddHomeworkDialog({ onAdd, userSubjects = [] }: AddHomeworkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useTheme();
  const [newHomework, setNewHomework] = useState<Omit<Homework, "id">>({
    title: "",
    date: "",
    dueDate: "",
    subject: "",
    note: "",
  });

  const subjects = userSubjects.length > 0 
    ? userSubjects 
    : [
        "Math",
        "English",
        "Science",
        "AI",
        "Hindi",
        "Social Science",
        "Computer",
        "Art",
        "Physics",
        "Chemistry",
        "Biology",
        "History",
        "Geography",
      ];

  const handleAdd = () => {
    if (newHomework.title && newHomework.date && newHomework.dueDate && newHomework.subject) {
      // Convert date format from YYYY-MM-DD to DD/MM/YYYY
      const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      };

      onAdd({
        ...newHomework,
        date: formatDate(newHomework.date),
        dueDate: formatDate(newHomework.dueDate),
      });
      setNewHomework({ title: "", date: "", dueDate: "", subject: "", note: "" });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="bg-[#e43d11] hover:bg-[#c73410] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Homework
          </Button>
        </motion.div>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className={`sm:max-w-[600px] border-0 shadow-2xl rounded-2xl overflow-hidden ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' 
              : 'bg-gradient-to-br from-white via-gray-50 to-orange-50/30'
          }`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header with Decorative Line */}
              <DialogHeader className="relative pb-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e43d11] via-orange-500 to-[#e43d11] rounded-full" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-3 pt-2"
                >
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-[#e43d11]/20' : 'bg-[#e43d11]/10'}`}>
                    <ClipboardList className="w-6 h-6 text-[#e43d11]" />
                  </div>
                  <DialogTitle className={`font-['Space_Grotesk',sans-serif] text-2xl ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Add New Homework
                  </DialogTitle>
                </motion.div>
              </DialogHeader>

              {/* Form Content */}
              <div className="grid gap-6 py-6">
                {/* Title Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2"
                >
                  <Label 
                    htmlFor="title" 
                    className={`font-['Space_Grotesk',sans-serif] flex items-center gap-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[#e43d11]" />
                    Homework Title
                    <span className="text-[#e43d11]">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={newHomework.title}
                    onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                    placeholder="e.g., Exercise 4.3 Q1-Q5"
                    className={`font-['Inter',sans-serif] rounded-xl border-2 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 focus:border-[#e43d11] text-white placeholder:text-gray-500' 
                        : 'bg-white border-gray-200 focus:border-[#e43d11] text-gray-900 placeholder:text-gray-400'
                    } focus:ring-2 focus:ring-[#e43d11]/20`}
                  />
                </motion.div>

                {/* Subject Select */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label 
                    htmlFor="subject" 
                    className={`font-['Space_Grotesk',sans-serif] flex items-center gap-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#e43d11]" />
                    Subject
                    <span className="text-[#e43d11]">*</span>
                  </Label>
                  <Select
                    value={newHomework.subject}
                    onValueChange={(value) => setNewHomework({ ...newHomework, subject: value })}
                  >
                    <SelectTrigger className={`font-['Inter',sans-serif] rounded-xl border-2 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 focus:border-[#e43d11] text-white' 
                        : 'bg-white border-gray-200 focus:border-[#e43d11] text-gray-900'
                    } focus:ring-2 focus:ring-[#e43d11]/20`}>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className={`rounded-xl border-2 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      {subjects.map((subject) => (
                        <SelectItem 
                          key={subject} 
                          value={subject} 
                          className={`font-['Inter',sans-serif] rounded-lg ${
                            darkMode 
                              ? 'text-gray-300 focus:bg-gray-700 focus:text-white' 
                              : 'text-gray-700 focus:bg-orange-50 focus:text-gray-900'
                          }`}
                        >
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Date Inputs */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label 
                      htmlFor="date" 
                      className={`font-['Space_Grotesk',sans-serif] flex items-center gap-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-[#e43d11]" />
                      Assigned Date
                      <span className="text-[#e43d11]">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newHomework.date}
                      onChange={(e) => setNewHomework({ ...newHomework, date: e.target.value })}
                      className={`font-['Inter',sans-serif] rounded-xl border-2 transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 focus:border-[#e43d11] text-white [color-scheme:dark]' 
                          : 'bg-white border-gray-200 focus:border-[#e43d11] text-gray-900'
                      } focus:ring-2 focus:ring-[#e43d11]/20 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                        darkMode 
                          ? '[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200' 
                          : '[&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100'
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="dueDate" 
                      className={`font-['Space_Grotesk',sans-serif] flex items-center gap-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-[#e43d11]" />
                      Due Date
                      <span className="text-[#e43d11]">*</span>
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newHomework.dueDate}
                      onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                      className={`font-['Inter',sans-serif] rounded-xl border-2 transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 focus:border-[#e43d11] text-white [color-scheme:dark]' 
                          : 'bg-white border-gray-200 focus:border-[#e43d11] text-gray-900'
                      } focus:ring-2 focus:ring-[#e43d11]/20 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                        darkMode 
                          ? '[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200' 
                          : '[&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100'
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Note Textarea */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label 
                    htmlFor="note" 
                    className={`font-['Space_Grotesk',sans-serif] flex items-center gap-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[#e43d11]" />
                    Note / Instructions
                  </Label>
                  <Textarea
                    id="note"
                    value={newHomework.note}
                    onChange={(e) => setNewHomework({ ...newHomework, note: e.target.value })}
                    placeholder="e.g., Solve in notebook, Use colored pencils..."
                    className={`font-['Inter',sans-serif] resize-none rounded-xl border-2 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 focus:border-[#e43d11] text-white placeholder:text-gray-500' 
                        : 'bg-white border-gray-200 focus:border-[#e43d11] text-gray-900 placeholder:text-gray-400'
                    } focus:ring-2 focus:ring-[#e43d11]/20`}
                    rows={3}
                  />
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex gap-3 pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className={`w-full font-['Space_Grotesk',sans-serif] rounded-xl border-2 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={handleAdd}
                    disabled={!newHomework.title || !newHomework.date || !newHomework.dueDate || !newHomework.subject}
                    className={`w-full font-['Space_Grotesk',sans-serif] rounded-xl shadow-lg transition-all duration-300 ${
                      !newHomework.title || !newHomework.date || !newHomework.dueDate || !newHomework.subject
                        ? 'bg-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-[#e43d11] to-orange-600 hover:from-[#c73410] hover:to-orange-700 shadow-[#e43d11]/30 hover:shadow-xl hover:shadow-[#e43d11]/40'
                    } text-white`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Homework
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}