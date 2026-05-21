"use client";

import { useState } from "react";
import { Header } from "./header";
import { NavigationTabs, type TabId } from "./navigation-tabs";
import { useAuth } from "@/lib/auth-context";
import LoadingCard from "../shared/loading";

interface MainLayoutProps {
  children: (activeTab: TabId, setActiveTab: (tab: TabId) => void) => React.ReactNode;
}

export function MainLayout({ 
  children 
}: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <LoadingCard loadingMessage="Loading data..." />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="p-6">
        {children(activeTab, setActiveTab)}
      </main>
    </div>
  );
}
