interface SkillDiffProps {
  required: string[];
  candidate: string[];
  className?: string;
}

export function SkillDiff({ required, candidate, className = "" }: SkillDiffProps) {
  const req = new Set(required.map((s) => s.toLowerCase()));
  const cand = new Set(candidate.map((s) => s.toLowerCase()));
  const missing = Array.from(req).filter((s) => !cand.has(s));
  const extra = Array.from(cand).filter((s) => !req.has(s));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {missing.length > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Missing: {missing.join(", ")}</span>
      )}
      {extra.length > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Extra: {extra.join(", ")}</span>
      )}
    </div>
  );
}


