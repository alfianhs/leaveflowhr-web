'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReviewTabProps {
  activeTab: 'pending' | 'reviewed';
  onTabChange: (tab: 'pending' | 'reviewed') => void;
}

export function ReviewTab({ 
  activeTab, onTabChange 
}: ReviewTabProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as 'pending' | 'reviewed')}
      className="mb-6"
    >
      <TabsList className="bg-gray-950">
        <TabsTrigger
          value="pending"
          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
        >
          Pending
        </TabsTrigger>
        <TabsTrigger
          value="reviewed"
          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
        >
          Reviewed
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
