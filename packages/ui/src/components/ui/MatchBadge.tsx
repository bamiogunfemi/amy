interface MatchBadgeProps {
  score: number; // 0..1 or 0..100
  className?: string;
}

export function MatchBadge({ score, className = "" }: MatchBadgeProps) {
  const pct = score <= 1 ? Math.round(score * 100) : Math.round(score);
  const color = pct >= 75 ? "bg-green-100 text-green-800" : pct >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color} ${className}`}>{pct}% match</span>;
}


