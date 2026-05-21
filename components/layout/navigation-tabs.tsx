"use client";

import { Badge } from "@/components/ui/badge";
import { usePendingApprovalsCount } from "@/hooks/use-approval";
import { useAuth } from "@/lib/auth-context";
import { canApprove } from "@/lib/utils";

export type TabId = "dashboard" | "new-request" | "approvals" | "my-history";

interface Tab {
  id: TabId;
  label: string;
  requiresApprovalRole?: boolean;
  showBadge?: boolean;
}

const allTabs: Tab[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "new-request", label: "New request" },
  { id: "approvals", label: "Approvals", requiresApprovalRole: true, showBadge: true },
  { id: "my-history", label: "My history" },
];

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function NavigationTabs({ 
  activeTab, 
  onTabChange, 
}: NavigationTabsProps) {
  const { user } = useAuth();

  const canUserApprove = canApprove(user);
  
    const { data } = usePendingApprovalsCount({
      enabled: canUserApprove,
    });
  
    const pendingApprovalsCount = data?.data ?? 0;
  
  // Filter tabs based on user role
  const visibleTabs = allTabs.filter((tab) => {
    if (tab.requiresApprovalRole) {
      return canUserApprove;
    }
    return true;
  });

  return (
    <nav className="flex items-center gap-6 px-6 border-b border-border">
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative py-3 text-sm font-medium transition-colors
            ${activeTab === tab.id 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
            }
          `}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.showBadge && pendingApprovalsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {pendingApprovalsCount}
              </Badge>
            )}
          </span>
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
          )}
        </button>
      ))}
    </nav>
  );
}
