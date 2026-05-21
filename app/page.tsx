"use client";

import { MainLayout } from "@/components/layout";
import { NewRequestForm } from "@/components/new-request";
import { DashboardTab } from "@/components/dashboard/dashboard-tab";
import { ApprovalsTab } from "@/components/approval/approvals-tab";
import { HistoriesTab } from "@/components/leave-history/history-tab";

export default function HomePage() {
  return (
    <MainLayout>
      {(activeTab, setActiveTab) => (
        <>
          {activeTab === "dashboard" && <DashboardTab />}

          {activeTab === "new-request" && <NewRequestForm onSuccess={() => setActiveTab("dashboard")} />}

          {activeTab === "approvals" && <ApprovalsTab />}

          {activeTab === "my-history" && <HistoriesTab />}
        </>
      )}
    </MainLayout>
  );
}
