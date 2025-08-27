import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Logo,
  Avatar,
} from "@amy/ui";
import {
  Plus,
  Filter,
  Clock,
  Eye,
  Edit,
  MoreHorizontal,
  LogOut,
  BarChart3,
  Search,
} from "lucide-react";
import {
  useLogout,
  useRecruiterMetrics,
  useCandidates,
  usePipelineStages,
} from "@amy/ui";
import { NAVIGATION_ITEMS, METRIC_CARDS } from "../constants";
import type { MetricCardProps, NavigationItemProps } from "../types";

const MetricCard = ({
  label,
  value,
  icon: Icon,
  color,
  change,
  changeColor,
  isLoading,
}: MetricCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-slate-900">
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
        ) : (
          value || 0
        )}
      </span>
    </div>
    <h3 className="text-sm font-semibold text-slate-900 mb-1">{label}</h3>
    <p className={`text-xs font-medium ${changeColor}`}>{change}</p>
  </div>
);

const NavigationItem = ({ item, isActive, onClick }: NavigationItemProps) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{item.label}</span>
    </button>
  );
};

const WelcomeSection = ({ greeting }: { greeting: string }) => (
  <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 text-white">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-2">{greeting}! 👋</h2>
        <p className="text-rose-100 text-lg">
          Here&apos;s what&apos;s happening with your recruitment pipeline today
        </p>
      </div>
      <div className="hidden md:block">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <BarChart3 className="h-10 w-10 text-white" />
        </div>
      </div>
    </div>
  </div>
);

export function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const logoutMutation = useLogout();
  const metricsQuery = useRecruiterMetrics();
  const candidatesQuery = useCandidates();
  const pipelineQuery = usePipelineStages();

  const metrics = metricsQuery.data;
  const candidates = candidatesQuery.data ?? [];
  const pipelineStages = pipelineQuery.data?.stages ?? [];

  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <WelcomeSection greeting={getGreeting()} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRIC_CARDS.map((card) => (
          <MetricCard
            key={card.key}
            label={card.label}
            value={
              typeof metrics?.[card.key as keyof typeof metrics] === "number"
                ? (metrics[card.key as keyof typeof metrics] as number)
                : Array.isArray(metrics?.[card.key as keyof typeof metrics])
                ? (metrics[card.key as keyof typeof metrics] as unknown[])
                    .length
                : 0
            }
            icon={card.icon}
            color={card.color}
            change={card.change}
            changeColor={card.changeColor}
            isLoading={metricsQuery.isLoading}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:text-rose-700"
          >
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {metricsQuery.isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50"
                >
                  <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : metrics?.recentActivity?.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={activity.candidateName} size="md" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500">
                      {activity.candidateName} •{" "}
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Candidates</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search candidates..."
                className="border rounded-md px-3 py-2"
              />
              <select className="border rounded-md px-3 py-2">
                <option>All Sources</option>
                <option>Manual</option>
                <option>Upload</option>
                <option>Import</option>
              </select>
              <select className="border rounded-md px-3 py-2">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {candidatesQuery.isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          : candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        name={`${candidate.firstName} ${candidate.lastName}`}
                        size="lg"
                      />
                      <div>
                        <h3 className="font-medium">{`${candidate.firstName} ${candidate.lastName}`}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {candidate.email && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">📧</span>
                              <span>{candidate.email}</span>
                            </div>
                          )}
                          {candidate.phone && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">📞</span>
                              <span>{candidate.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(
                                candidate.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pipeline</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {pipelineQuery.isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-20 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          : pipelineStages.map((stage) => (
              <Card key={stage.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{stage.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {(stage as { applications?: unknown[] }).applications
                        ?.length || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(
                      stage as {
                        applications?: Array<{
                          id: string;
                          application?: {
                            candidate?: { name?: string };
                            createdAt?: string;
                          };
                        }>;
                      }
                    ).applications?.map((app) => (
                      <div key={app.id} className="p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Avatar
                            name={app.application?.candidate?.name}
                            size="sm"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {app.application?.candidate?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {app.application?.createdAt
                                ? new Date(
                                    app.application.createdAt
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Search</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search candidates, skills, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
              />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {searchQuery && (
              <div className="text-sm text-muted-foreground">
                Search results for &rdquo;{searchQuery}&rdquo; will appear
                here...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "candidates":
        return renderCandidates();
      case "pipeline":
        return renderPipeline();
      case "search":
        return renderSearch();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Logo size="md" />

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {getGreeting()}, Recruiter
              </p>
            </div>
            <Avatar name="Recruiter" size="sm" />
            <Button
              variant="ghost"
              onClick={handleSignOut}
              disabled={logoutMutation.isPending}
              className="text-slate-600 hover:text-slate-900"
            >
              {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 min-h-screen">
          <nav className="p-6 space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>

          <div className="px-6 mt-auto pt-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 hover:text-slate-900"
              onClick={handleSignOut}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5 mr-3" />
              {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
