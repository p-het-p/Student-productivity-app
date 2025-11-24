import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, X, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeContext";

interface TimetableEvent {
  id: string;
  subject: string;
  day: number; // 0 = Monday, 6 = Sunday
  startTime: number; // in minutes from midnight
  duration: number; // in minutes
  color: string;
  location?: string;
  notes?: string;
}

interface TimetablePageRedesignProps {
  userSubjects?: string[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i); // 00:00 to 23:00 (full 24 hours)
const STORAGE_KEY = "hwork_timetable_events";

const PRESET_COLORS = [
  "#FFC0CB", // Pink
  "#B8B8FF", // Blue
  "#FFFF99", // Yellow
  "#90EE90", // Green
  "#FFB6B6", // Light Red
  "#FFD700", // Gold
  "#87CEEB", // Sky Blue
  "#DDA0DD", // Plum
  "#F0E68C", // Khaki
  "#98FB98", // Pale Green
];

export function TimetablePageRedesign({ userSubjects }: TimetablePageRedesignProps) {
  const { darkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState(0); // For day view
  
  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    day: 0,
    startHour: 9,
    startMinute: 0,
    durationHours: 1,
    durationMinutes: 0,
    color: PRESET_COLORS[0],
    location: "",
    notes: "",
  });

  const [events, setEvents] = useState<TimetableEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved events", e);
      }
    }
    return [
      {
        id: "1",
        subject: "Math",
        day: 0,
        startTime: 9 * 60,
        duration: 90,
        color: "#FFC0CB",
      },
      {
        id: "2",
        subject: "Physics",
        day: 1,
        startTime: 9 * 60,
        duration: 90,
        color: "#B8B8FF",
      },
      {
        id: "3",
        subject: "Social Science",
        day: 3,
        startTime: 7 * 60 + 30,
        duration: 120,
        color: "#FFFF99",
      },
      {
        id: "4",
        subject: "Hindi",
        day: 4,
        startTime: 7 * 60 + 30,
        duration: 90,
        color: "#90EE90",
      },
      {
        id: "5",
        subject: "English",
        day: 3,
        startTime: 11 * 60 + 30,
        duration: 90,
        color: "#FFB6B6",
      },
      {
        id: "6",
        subject: "Social Science",
        day: 1,
        startTime: 11 * 60,
        duration: 90,
        color: "#FFFF99",
      },
    ];
  });

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const resetForm = () => {
    setFormData({
      subject: "",
      day: viewMode === "day" ? selectedDay : 0,
      startHour: 9,
      startMinute: 0,
      durationHours: 1,
      durationMinutes: 0,
      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      location: "",
      notes: "",
    });
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    resetForm();
    setShowAddEventDialog(true);
  };

  const handleEditEvent = (event: TimetableEvent) => {
    setEditingEvent(event);
    const startHour = Math.floor(event.startTime / 60);
    const startMinute = event.startTime % 60;
    const durationHours = Math.floor(event.duration / 60);
    const durationMinutes = event.duration % 60;

    setFormData({
      subject: event.subject,
      day: event.day,
      startHour,
      startMinute,
      durationHours,
      durationMinutes,
      color: event.color,
      location: event.location || "",
      notes: event.notes || "",
    });
    setShowAddEventDialog(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const handleSaveEvent = () => {
    if (!formData.subject.trim()) {
      alert("Please enter a subject name");
      return;
    }

    const startTime = formData.startHour * 60 + formData.startMinute;
    const duration = formData.durationHours * 60 + formData.durationMinutes;

    if (duration <= 0) {
      alert("Duration must be greater than 0");
      return;
    }

    const newEvent: TimetableEvent = {
      id: editingEvent?.id || Date.now().toString(),
      subject: formData.subject,
      day: formData.day,
      startTime,
      duration,
      color: formData.color,
      location: formData.location,
      notes: formData.notes,
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? newEvent : e));
    } else {
      setEvents([...events, newEvent]);
    }

    setShowAddEventDialog(false);
    resetForm();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Adjust first day (0 = Sunday, 1 = Monday, etc.)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Add empty cells for days before month starts
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSunday = date.getDay() === 0;

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.1 }}
          className={`p-2 text-center cursor-pointer rounded-lg ${
            isToday ? 'bg-[#e43d11] text-white' : isSunday ? 'text-[#e43d11]' : 'text-black'
          } ${!isToday && 'hover:bg-gray-200'}`}
        >
          {day}
        </motion.div>
      );
    }

    return days;
  };

  const getTimeString = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const renderEvent = (event: TimetableEvent, isWeekView = true) => {
    const dayIndex = event.day;
    
    // Calculate position - now starts from 00:00 (midnight)
    const top = (event.startTime / 60) * 80; // 80px per hour, starting from 0:00
    const height = (event.duration / 60) * 80;
    const left = isWeekView ? dayIndex * (100 / 7) : 0;
    const width = isWeekView ? 100 / 7 : 100;

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, zIndex: 10 }}
        className="absolute rounded-lg p-3 cursor-pointer group shadow-sm"
        style={{
          backgroundColor: event.color,
          top: `${top}px`,
          left: `${left}%`,
          width: `${width}%`,
          height: `${height}px`,
          minHeight: '50px',
        }}
      >
        <div className="text-sm font-semibold text-gray-800">{event.subject}</div>
        <div className="text-xs text-gray-700 mt-1">
          {getTimeString(event.startTime)} - {getTimeString(event.startTime + event.duration)}
        </div>
        {event.location && (
          <div className="text-xs text-gray-600 mt-1">📍 {event.location}</div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleEditEvent(event);
            }}
            className="p-1.5 bg-white rounded hover:bg-gray-100 shadow"
          >
            <Edit className="w-3.5 h-3.5 text-[#e43d11]" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEvent(event.id);
            }}
            className="p-1.5 bg-white rounded hover:bg-gray-100 shadow"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </motion.div>
    );
  };

  const renderDayView = () => {
    const dayEvents = events.filter(e => e.day === selectedDay);
    
    return (
      <div className="relative overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 400px)' }}>
        <div className="relative" style={{ height: '1920px' }}>
          {TIME_SLOTS.map((hour, index) => (
            <div key={hour} className="absolute w-full" style={{ top: `${index * 80}px` }}>
              <div className="flex">
                <div className={`w-20 p-2 text-sm font-medium transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className={`flex-1 border-t transition-colors duration-500 ${darkMode ? 'border-gray-600' : 'border-gray-200'} h-[80px]`}></div>
              </div>
            </div>
          ))}
          
          {/* Events */}
          <div className="absolute inset-0" style={{ marginLeft: '80px' }}>
            {dayEvents.map(event => renderEvent(event, false))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-[#ece9e2]'} rounded-tl-[57px] rounded-tr-[57px] min-h-screen p-8`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl font-['Poppins',sans-serif] font-medium transition-colors duration-500 ${darkMode ? 'text-white' : 'text-[#e43d11]'}`}
          >
            Schedules
          </motion.h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Timetable */}
          <div className={`rounded-2xl p-6 transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
            {/* Week Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <p className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  GMT + 05:30
                </p>
                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                    className={viewMode === "week" ? "bg-[#e43d11] text-white" : "border-gray-300"}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("day")}
                    className={viewMode === "day" ? "bg-[#e43d11] text-white" : "border-gray-300"}
                  >
                    Day
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleAddEvent}
                variant="outline"
                className="border-[#e43d11] text-[#e43d11] hover:bg-[#e43d11] hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>

            {/* Day Selector for Day View */}
            {viewMode === "day" && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {DAYS.map((day, index) => (
                  <Button
                    key={day}
                    variant={selectedDay === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(index)}
                    className={`min-w-[80px] ${
                      selectedDay === index 
                        ? "bg-[#e43d11] text-white" 
                        : index === 6 
                        ? "border-[#e43d11] text-[#e43d11]" 
                        : ""
                    }`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            )}

            {/* Week View */}
            {viewMode === "week" && (
              <>
                {/* Day Headers */}
                <div className="grid grid-cols-8 gap-0 mb-4">
                  <div className="p-2"></div>
                  {DAYS.map((day, index) => (
                    <div
                      key={day}
                      className={`p-2 text-center font-medium ${
                        index === 6 ? 'text-[#e43d11]' : darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Grid - Scrollable */}
                <div className="relative overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                  {/* Time labels and grid lines */}
                  <div className="relative" style={{ height: '1920px' }}>
                    {TIME_SLOTS.map((hour, index) => (
                      <div key={hour} className="absolute w-full" style={{ top: `${index * 80}px` }}>
                        <div className="grid grid-cols-8 gap-0">
                          <div className={`p-2 text-sm transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {hour.toString().padStart(2, '0')}:00
                          </div>
                          {DAYS.map((_, dayIndex) => (
                            <div
                              key={dayIndex}
                              className={`border-t transition-colors duration-500 ${darkMode ? 'border-gray-600' : 'border-gray-200'} h-[80px]`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Vertical day separators */}
                    <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
                      <div></div>
                      {DAYS.map((_, index) => (
                        <div
                          key={index}
                          className={`border-r transition-colors duration-500 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                        ></div>
                      ))}
                    </div>

                    {/* Events */}
                    <div className="absolute inset-0 pointer-events-none" style={{ marginLeft: '12.5%' }}>
                      <div className="relative w-full h-full pointer-events-auto">
                        {events.map(event => renderEvent(event, true))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Day View */}
            {viewMode === "day" && renderDayView()}
          </div>

          {/* Mini Calendar */}
          <div className={`rounded-2xl p-6 transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-medium transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentDate.toLocaleString('default', { month: 'long' })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className={`p-1 rounded hover:bg-gray-200 transition-colors duration-500 ${darkMode ? 'text-gray-300 hover:bg-gray-600' : ''}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className={`p-1 rounded hover:bg-gray-200 transition-colors duration-500 ${darkMode ? 'text-gray-300 hover:bg-gray-600' : ''}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-1 text-xs mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className={`text-center font-medium transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">{renderCalendar()}</div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t">
              <h4 className={`text-sm font-medium mb-3 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Subjects
              </h4>
              <div className="space-y-2">
                {Array.from(new Set(events.map(e => e.subject))).map((subject) => {
                  const event = events.find(e => e.subject === subject);
                  return (
                    <div key={subject} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: event?.color }}
                      ></div>
                      <span className={`text-sm transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {subject}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Event Dialog */}
        <AnimatePresence>
          {showAddEventDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddEventDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {editingEvent ? 'Edit Event' : 'Add Event'}
                  </h2>
                  <button
                    onClick={() => setShowAddEventDialog(false)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-600'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Subject */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject / Event Name *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-[#e43d11] focus:border-transparent`}
                      placeholder="e.g., Math Class"
                    />
                  </div>

                  {/* Day */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Day *
                    </label>
                    <select
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-[#e43d11] focus:border-transparent`}
                    >
                      {DAYS.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Start Time *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hour</label>
                        <select
                          value={formData.startHour}
                          onChange={(e) => setFormData({ ...formData, startHour: parseInt(e.target.value) })}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minute</label>
                        <select
                          value={formData.startMinute}
                          onChange={(e) => setFormData({ ...formData, startMinute: parseInt(e.target.value) })}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {[0, 15, 30, 45].map((min) => (
                            <option key={min} value={min}>{min.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Duration *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hours</label>
                        <select
                          value={formData.durationHours}
                          onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) })}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {Array.from({ length: 13 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minutes</label>
                        <select
                          value={formData.durationMinutes}
                          onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {[0, 15, 30, 45].map((min) => (
                            <option key={min} value={min}>{min}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Color
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-full h-10 rounded-lg border-2 ${
                            formData.color === color ? 'border-[#e43d11] scale-110' : 'border-transparent'
                          } transition-all hover:scale-105`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-[#e43d11] focus:border-transparent`}
                      placeholder="e.g., Room 101"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-[#e43d11] focus:border-transparent resize-none`}
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setShowAddEventDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEvent}
                    className="flex-1 bg-[#e43d11] hover:bg-[#c43510] text-white"
                  >
                    {editingEvent ? 'Update' : 'Add'} Event
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}