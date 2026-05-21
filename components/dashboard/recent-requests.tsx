"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeaveRequest } from "@/app/_models";
import { formatDateRange, formatDateTimeToJakarta, getStatusBadgeStyles } from "@/lib/utils";

interface RecentRequestsProps {
  requests: LeaveRequest[];
}

export function RecentRequests({
  requests
}: RecentRequestsProps) {
  const getTypeBadgeStyles = (type: string) => {
    if (type === "Annual") {
      return "bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/20";
    }
    return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/20";
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Recent Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Dates</TableHead>
              <TableHead className="text-muted-foreground">Days</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">RequestedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                  No leave requests found
                </TableCell>
              </TableRow>
            ) : (requests.map((request) => (
              <TableRow key={request.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getTypeBadgeStyles(request.type.value)}
                  >
                    {request.type.value.charAt(0).toUpperCase() + request.type.value.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground">
                  {formatDateRange(new Date(request.startDate), new Date(request.endDate))}
                </TableCell>
                <TableCell className="text-foreground">{request.totalDays}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeStyles(request.status?.value || "")}
                  >
                    {request.status?.value ? request.status.value.charAt(0).toUpperCase() + request.status.value.slice(1) : "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDateTimeToJakarta(request.createdAt || "2002-01-01T00:00:00.000")}
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
