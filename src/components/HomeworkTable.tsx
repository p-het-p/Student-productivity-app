import { Download, Trash2, Calendar, BookOpen, FileText, CheckCircle2, Circle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface Homework {
  id: number;
  title: string;
  date: string;
  dueDate: string;
  subject: string;
  note: string;
  completed?: boolean;
  completedAt?: string;
}

interface HomeworkTableProps {
  homeworks: Homework[];
  onRemove: (id: number) => void;
  onDownload: (homework: Homework) => void;
  onToggleComplete?: (id: number, completed: boolean) => void;
}

export function HomeworkTable({ homeworks, onRemove, onDownload, onToggleComplete }: HomeworkTableProps) {
  const getStatusBadge = (dueDate: string) => {
    const due = new Date(dueDate.split('/').reverse().join('-'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
    } else if (diffDays === 0) {
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">Due Today</Badge>;
    } else if (diffDays <= 2) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Soon</Badge>;
    } else {
      return <Badge variant="secondary" className="text-xs">Upcoming</Badge>;
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      Math: "bg-blue-100 text-blue-700 border-blue-200",
      English: "bg-purple-100 text-purple-700 border-purple-200",
      Science: "bg-green-100 text-green-700 border-green-200",
      AI: "bg-cyan-100 text-cyan-700 border-cyan-200",
      Hindi: "bg-pink-100 text-pink-700 border-pink-200",
      "Social Science": "bg-amber-100 text-amber-700 border-amber-200",
      Computer: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Art: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return colors[subject] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (homeworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500">No homework found. Add your first assignment!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#e43d11]">
              <th className="text-left py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11] w-12">
                
              </th>
              <th className="text-left py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11]">
                Homework
              </th>
              <th className="text-left py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11]">
                Subject
              </th>
              <th className="text-left py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11]">
                Date
              </th>
              <th className="text-left py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11]">
                Due Date
              </th>
              <th className="text-left py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11]">
                Status
              </th>
              <th className="text-left py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11]">
                Note
              </th>
              <th className="text-right py-4 px-4 font-['Poppins:Medium',sans-serif] text-[#e43d11]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {homeworks.map((homework, index) => (
              <tr
                key={homework.id}
                className={`border-b border-gray-200 hover:bg-[#ece9e2]/30 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                } ${homework.completed ? "opacity-60" : ""}`}
              >
                <td className="py-4 px-4">
                  <button
                    onClick={() => onToggleComplete?.(homework.id, !homework.completed)}
                    className="group cursor-pointer"
                  >
                    {homework.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 transition-all group-hover:scale-110" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 transition-all group-hover:text-[#e43d11] group-hover:scale-110" />
                    )}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#e43d11] mt-0.5 flex-shrink-0" />
                    <span className={`font-['Poppins:Regular',sans-serif] ${homework.completed ? "line-through" : ""}`}>
                      {homework.title}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge
                    variant="outline"
                    className={`${getSubjectColor(homework.subject)} border`}
                  >
                    {homework.subject}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-['Poppins:Regular',sans-serif]">
                      {homework.date}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="font-['Poppins:Regular',sans-serif] text-gray-700">
                    {homework.dueDate}
                  </span>
                </td>
                <td className="py-4 px-4">{getStatusBadge(homework.dueDate)}</td>
                <td className="py-4 px-4">
                  <span className="font-['Poppins:Regular',sans-serif] text-gray-600 text-sm">
                    {homework.note}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(homework)}
                      className="hover:bg-[#d5536d]/10 hover:text-[#d5536d]"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(homework.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {homeworks.map((homework) => (
          <div
            key={homework.id}
            className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow ${homework.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <button
                onClick={() => onToggleComplete?.(homework.id, !homework.completed)}
                className="group cursor-pointer mt-1"
              >
                {homework.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 transition-all group-hover:scale-110" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 transition-all group-hover:text-[#e43d11] group-hover:scale-110" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-5 h-5 text-[#e43d11] mt-0.5 flex-shrink-0" />
                  <h3 className={`font-['Poppins:Medium',sans-serif] ${homework.completed ? "line-through" : ""}`}>
                    {homework.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`${getSubjectColor(homework.subject)} border text-xs`}
                  >
                    {homework.subject}
                  </Badge>
                  {getStatusBadge(homework.dueDate)}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="font-['Poppins:Regular',sans-serif]">
                  {homework.date} → {homework.dueDate}
                </span>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-sm text-gray-600">
                {homework.note}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(homework)}
                className="flex items-center gap-2 border-[#d5536d] text-[#d5536d] hover:bg-[#d5536d]/10"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(homework.id)}
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}