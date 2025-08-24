import type { NAVIGATION_ITEMS, METRIC_CARDS } from "../constants";

export type NavigationItem = (typeof NAVIGATION_ITEMS)[number];
export type MetricCard = (typeof METRIC_CARDS)[number];

export interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change: string;
  changeColor: string;
  isLoading: boolean;
}

export interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}
