import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";

export interface SyllabusTopic {
  id: number;
  subject: string;
  chapter: string;
  topic: string;
  description?: string;
  completed: boolean;
}

interface SyllabusPageProps {
  userSubjects: string[];
}

const STORAGE_KEY = "hwork_syllabus";

export function SyllabusPage({ userSubjects }: SyllabusPageProps) {
  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved syllabus", e);
      }
    }
    return [];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [newTopic, setNewTopic] = useState({
    subject: "",
    chapter: "",
    topic: "",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(syllabus));
  }, [syllabus]);

  const handleAddTopic = () => {
    if (newTopic.subject && newTopic.chapter && newTopic.topic) {
      setSyllabus([
        ...syllabus,
        {
          id: Date.now(),
          ...newTopic,
          completed: false,
        },
      ]);
      setNewTopic({
        subject: "",
        chapter: "",
        topic: "",
        description: "",
      });
      setIsDialogOpen(false);
    }
  };

  const handleToggleComplete = (id: number) => {
    setSyllabus(
      syllabus.map((topic) =>
        topic.id === id ? { ...topic, completed: !topic.completed } : topic
      )
    );
  };

  const handleRemoveTopic = (id: number) => {
    setSyllabus(syllabus.filter((topic) => topic.id !== id));
  };

  const toggleSubject = (subject: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  const getSubjectGroups = () => {
    const groups: { [key: string]: SyllabusTopic[] } = {};
    syllabus.forEach((topic) => {
      if (!groups[topic.subject]) {
        groups[topic.subject] = [];
      }
      groups[topic.subject].push(topic);
    });
    return groups;
  };

  const getSubjectProgress = (topics: SyllabusTopic[]) => {
    if (topics.length === 0) return 0;
    const completed = topics.filter((t) => t.completed).length;
    return Math.round((completed / topics.length) * 100);
  };

  const subjectGroups = getSubjectGroups();

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
                Syllabus Tracker
              </h1>
              <p className="text-gray-600">Track your course content and progress</p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#e43d11] hover:bg-[#c73410] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Topic
            </Button>
          </div>
        </motion.div>

        {/* Syllabus List */}
        {Object.keys(subjectGroups).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No topics yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your syllabus by adding topics</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Topic
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(subjectGroups).map(([subject, topics], index) => {
              const isExpanded = expandedSubjects.has(subject);
              const progress = getSubjectProgress(topics);
              const completedCount = topics.filter((t) => t.completed).length;

              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleSubject(subject)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <BookOpen className="w-6 h-6 text-[#e43d11]" />
                      <div className="text-left flex-1">
                        <h3 className="font-['Space_Grotesk',sans-serif] text-xl text-gray-900">
                          {subject}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {completedCount} of {topics.length} topics completed
                        </p>
                        <div className="mt-3 max-w-md">
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 p-6"
                    >
                      <div className="space-y-3">
                        {topics.map((topic, topicIndex) => (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: topicIndex * 0.05 }}
                            className={`p-4 rounded-xl border transition-all group ${
                              topic.completed
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200 hover:border-[#e43d11]"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleToggleComplete(topic.id)}
                                className="mt-0.5"
                              >
                                {topic.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400 hover:text-[#e43d11]" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4
                                      className={`font-medium ${
                                        topic.completed
                                          ? "line-through text-gray-500"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {topic.chapter}
                                    </h4>
                                    <p
                                      className={`text-sm mt-1 ${
                                        topic.completed ? "text-gray-400" : "text-gray-600"
                                      }`}
                                    >
                                      {topic.topic}
                                    </p>
                                    {topic.description && (
                                      <p className="text-sm text-gray-500 mt-2">
                                        {topic.description}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleRemoveTopic(topic.id)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all flex-shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Topic Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Syllabus Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Subject</Label>
              <Select
                value={newTopic.subject}
                onValueChange={(value) => setNewTopic({ ...newTopic, subject: value })}
              >
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
              <Label>Chapter/Unit</Label>
              <Input
                value={newTopic.chapter}
                onChange={(e) => setNewTopic({ ...newTopic, chapter: e.target.value })}
                placeholder="e.g., Chapter 5: Linear Equations"
              />
            </div>
            <div>
              <Label>Topic</Label>
              <Input
                value={newTopic.topic}
                onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
                placeholder="e.g., Solving two-step equations"
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={newTopic.description}
                onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                placeholder="Additional notes or details"
                rows={3}
              />
            </div>
            <Button
              onClick={handleAddTopic}
              className="w-full bg-[#e43d11] hover:bg-[#c73410] text-white"
            >
              Add Topic
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
