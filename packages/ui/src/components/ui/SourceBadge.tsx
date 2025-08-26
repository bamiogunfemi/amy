interface SourceBadgeProps {
  source: string;
  className?: string;
}

export function SourceBadge({ source, className = "" }: SourceBadgeProps) {
  const map: Record<string, string> = {
    MANUAL: "bg-slate-100 text-slate-800",
    CSV: "bg-blue-100 text-blue-800",
    GOOGLE_SHEETS: "bg-green-100 text-green-800",
    AIRTABLE: "bg-cyan-100 text-cyan-800",
    UPLOAD: "bg-purple-100 text-purple-800",
  };
  const color = map[source] || "bg-slate-100 text-slate-800";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color} ${className}`}>{source}</span>;
}


