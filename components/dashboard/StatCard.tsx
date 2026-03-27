import { Card } from "../ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  colorClass: string;
}

export function StatCard({ label, value, colorClass }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-on-surface/70 font-medium text-sm">{label}</h3>
        <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
      </div>
      <p className="text-3xl font-bold text-on-surface">{value}</p>
    </Card>
  );
}
