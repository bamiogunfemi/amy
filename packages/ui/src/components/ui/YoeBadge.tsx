interface YoeBadgeProps {
  claimed?: number | null;
  actual?: number | null;
  className?: string;
}

export function YoeBadge({ claimed, actual, className = "" }: YoeBadgeProps) {
  const c = typeof claimed === "number" ? claimed : undefined;
  const a = typeof actual === "number" ? actual : undefined;
  const gap = c !== undefined && a !== undefined ? (c - a) : undefined;
  const color = gap !== undefined && gap > 1 ? "bg-yellow-100 text-yellow-800" : "bg-slate-100 text-slate-800";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color} ${className}`}>
      {a !== undefined ? `${a.toFixed(1)}y` : "?y"}
      {c !== undefined ? ` (claimed ${c}y)` : ""}
    </span>
  );
}


