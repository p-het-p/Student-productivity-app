import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { HomeworkTable } from "./HomeworkTable";
import { AddHomeworkDialog } from "./AddHomeworkDialog";
import type { Homework } from "./HomeworkTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface HomeworkSectionProps {
  homeworks: Homework[];
  onAdd: (homework: Omit<Homework, "id">) => void;
  onRemove: (id: number) => void;
  onDownload: (homework: Homework) => void;
  onToggleComplete?: (id: number, completed: boolean) => void;
  userSubjects?: string[];
}

export function HomeworkSection({
  homeworks,
  onAdd,
  onRemove,
  onDownload,
  onToggleComplete,
  userSubjects = [],
}: HomeworkSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHomeworks = homeworks.filter(
    (hw) =>
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredByStatus = (status: "all" | "today" | "upcoming" | "overdue") => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === "all") return filteredHomeworks;

    return filteredHomeworks.filter((hw) => {
      const due = new Date(hw.dueDate.split("/").reverse().join("-"));
      due.setHours(0, 0, 0, 0);

      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (status === "today") return diffDays === 0;
      if (status === "upcoming") return diffDays > 0;
      if (status === "overdue") return diffDays < 0;
      return true;
    });
  };

  return (
    <section id="homework" className="py-16 bg-gradient-to-b from-white to-[#ece9e2]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#e43d11] text-3xl md:text-4xl mb-4">
            Your Homework Dashboard
          </h2>
          <p className="font-['Poppins:Regular',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
            Manage all your assignments in one place. Stay organized and never
            miss a deadline.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search homework by title, subject, or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 focus:border-[#e43d11] rounded-xl font-['Poppins:Regular',sans-serif] shadow-sm"
              />
            </div>
          </div>
          <AddHomeworkDialog onAdd={onAdd} userSubjects={userSubjects} />
        </div>

        {/* Tabs for Filtering */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 mb-6">
            <TabsTrigger value="all" className="font-['Poppins:Medium',sans-serif]">
              All ({getFilteredByStatus("all").length})
            </TabsTrigger>
            <TabsTrigger value="today" className="font-['Poppins:Medium',sans-serif]">
              Today ({getFilteredByStatus("today").length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="font-['Poppins:Medium',sans-serif]">
              Upcoming ({getFilteredByStatus("upcoming").length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="font-['Poppins:Medium',sans-serif]">
              Overdue ({getFilteredByStatus("overdue").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
              <HomeworkTable
                homeworks={getFilteredByStatus("all")}
                onRemove={onRemove}
                onDownload={onDownload}
                onToggleComplete={onToggleComplete}
              />
            </div>
          </TabsContent>

          <TabsContent value="today" className="mt-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
              <HomeworkTable
                homeworks={getFilteredByStatus("today")}
                onRemove={onRemove}
                onDownload={onDownload}
                onToggleComplete={onToggleComplete}
              />
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
              <HomeworkTable
                homeworks={getFilteredByStatus("upcoming")}
                onRemove={onRemove}
                onDownload={onDownload}
                onToggleComplete={onToggleComplete}
              />
            </div>
          </TabsContent>

          <TabsContent value="overdue" className="mt-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
              <HomeworkTable
                homeworks={getFilteredByStatus("overdue")}
                onRemove={onRemove}
                onDownload={onDownload}
                onToggleComplete={onToggleComplete}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}