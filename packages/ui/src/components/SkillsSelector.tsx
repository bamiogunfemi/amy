import { useState, useRef, useEffect } from "react";
import { Search, X, Plus } from "lucide-react";
import { Input } from "./input";
import { Badge } from "./ui/badge";
import { useSkillsSearch } from "../hooks/useRecruiter";

export interface SelectedSkill {
  id: string;
  name: string; // Use 'name' to match SkillData interface
  category: string;
  proficiency: number;
}

interface SkillsSelectorProps {
  selectedSkills: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
  className?: string;
}

export function SkillsSelector({
  selectedSkills,
  onSkillsChange,
  className,
}: SkillsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading } = useSkillsSearch(searchQuery);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSkill = (skill: any) => {
    const newSkill: SelectedSkill = {
      id: skill.id,
      name: skill.label, // API returns 'label', convert to 'name' for our interface
      category: skill.category,
      proficiency: 3, // Default to level 3
    };

    // Check if skill is already selected
    if (!selectedSkills.find((s) => s.id === skill.id)) {
      onSkillsChange([...selectedSkills, newSkill]);
    }

    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleRemoveSkill = (skillId: string) => {
    onSkillsChange(selectedSkills.filter((s) => s.id !== skillId));
  };

  const handleProficiencyChange = (skillId: string, proficiency: number) => {
    onSkillsChange(
      selectedSkills.map((s) => (s.id === skillId ? { ...s, proficiency } : s))
    );
  };

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner";
      case 2:
        return "Elementary";
      case 3:
        return "Intermediate";
      case 4:
        return "Advanced";
      case 5:
        return "Expert";
      default:
        return "Intermediate";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "LANG":
        return "bg-blue-100 text-blue-800";
      case "FRAMEWORK":
        return "bg-green-100 text-green-800";
      case "DB":
        return "bg-purple-100 text-purple-800";
      case "CLOUD":
        return "bg-orange-100 text-orange-800";
      case "TOOL":
        return "bg-gray-100 text-gray-800";
      case "SOFT":
        return "bg-pink-100 text-pink-800";
      case "CERT":
        return "bg-yellow-100 text-yellow-800";
      case "DOMAIN":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Skills Search */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search for skills..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-slate-500">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-slate-500">
                No skills found
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleAddSkill(skill)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
                    disabled={!!selectedSkills.find((s) => s.id === skill.id)}
                    title={
                      selectedSkills.find((s) => s.id === skill.id)
                        ? "Skill already added"
                        : `Add ${skill.label}`
                    }
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">
                        {skill.label}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`mt-1 w-fit ${getCategoryColor(
                          skill.category
                        )}`}
                      >
                        {skill.category}
                      </Badge>
                    </div>
                    {selectedSkills.find((s) => s.id === skill.id) && (
                      <span className="text-slate-400 text-sm">
                        Already added
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700">
            Selected Skills
          </h4>
          <div className="space-y-2">
            {selectedSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-base">
                      {skill.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`mt-1 w-fit ${getCategoryColor(
                        skill.category
                      )}`}
                    >
                      {skill.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Proficiency Selector */}
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-slate-500 mr-2">Level:</span>
                    <select
                      value={skill.proficiency}
                      onChange={(e) =>
                        handleProficiencyChange(
                          skill.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      aria-label={`Select proficiency level for ${skill.name}`}
                      title={`Select proficiency level for ${skill.name}`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          {level} - {getProficiencyLabel(level)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title={`Remove ${skill.name} skill`}
                    aria-label={`Remove ${skill.name} skill`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedSkills.length === 0 && (
        <div className="text-center py-6 text-slate-500">
          <Plus className="h-8 w-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">No skills selected yet</p>
          <p className="text-xs text-slate-400">Search and add skills above</p>
        </div>
      )}
    </div>
  );
}
