import { Card } from "../ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  colorClass: string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, colorClass, icon: Icon }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border-outline/10">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl ${colorClass}`}></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-on-surface/70 font-medium text-sm tracking-wide uppercase">{label}</h3>
        <div className={`p-2 rounded-xl ${colorClass.replace('bg-', 'bg-').replace('text-', 'bg-')}/10`}>
          {Icon ? <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} /> : <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>}
        </div>
      </div>
      <p className="text-4xl font-bold text-on-surface relative z-10">{value}</p>
    </Card>
  );
}
