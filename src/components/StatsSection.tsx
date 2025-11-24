import { BookOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import type { Homework } from "./HomeworkTable";

interface StatsSectionProps {
  homeworks: Homework[];
}

export function StatsSection({ homeworks }: StatsSectionProps) {
  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let overdue = 0;
    let dueToday = 0;
    let upcoming = 0;

    homeworks.forEach((hw) => {
      const due = new Date(hw.dueDate.split("/").reverse().join("-"));
      due.setHours(0, 0, 0, 0);

      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        overdue++;
      } else if (diffDays === 0) {
        dueToday++;
      } else {
        upcoming++;
      }
    });

    return { total: homeworks.length, overdue, dueToday, upcoming };
  };

  const stats = getStats();

  const statCards = [
    {
      title: "Total Homework",
      value: stats.total,
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Due Today",
      value: stats.dueToday,
      icon: Clock,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      title: "Upcoming",
      value: stats.upcoming,
      icon: CheckCircle2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-['Poppins:Regular',sans-serif] text-gray-600 text-sm mb-1">
                      {stat.title}
                    </p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-3xl text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
