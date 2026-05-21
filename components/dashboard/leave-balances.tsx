"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeaveBalancesProps {
  annualLeave: {
    remaining: number;
    total: number;
    used: number;
    pending: number;
  };
  sickLeave: {
    taken: number;
    hasLimit: boolean;
  };
}

export function LeaveBalances({ 
  annualLeave, 
  sickLeave 
}: LeaveBalancesProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Leave Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Annual Leave Card */}
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Annual leave</p>
              <p className="text-4xl font-bold text-green-500">{annualLeave.remaining}</p>
              <p className="text-sm text-muted-foreground mt-2">
                of {annualLeave.total} days remaining
              </p>
              <p className="text-sm text-muted-foreground">
                {annualLeave.used} used · {annualLeave.pending} pending
              </p>
            </CardContent>
          </Card>

          {/* Sick Leave Card */}
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Sick leave</p>
              <div className="h-10 flex items-end">
                <span className="text-4xl font-bold text-foreground">{sickLeave.taken}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                days taken this year
              </p>
              <p className="text-sm text-muted-foreground italic">
                {sickLeave.hasLimit ? "Limited" : "No balance limit"}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
