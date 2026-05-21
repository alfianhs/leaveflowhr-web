"use client";

import { useState, useMemo } from "react";
import { format, differenceInBusinessDays, addDays } from "date-fns";
import { CalendarIcon, Square, CheckSquare, Loader2, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateRange } from "@/lib/utils";
import type { LeaveTypeApi } from "@/app/_models";
import { useAuth } from "@/lib/auth-context";
import { useCreateLeaveRequest } from "@/hooks/use-leave-request";
import { Controller, useForm } from "react-hook-form";
import { ApiException } from "@/lib/error-utils";
import { useLeaveBalance } from "@/hooks/use-leave-balance";
import LoadingCard from "../shared/loading";

type LeaveType = "ANNUAL" | "SICK";

interface NewRequestFormProps {
  onSuccess?: () => void;
}

type FormValues = {
  type: LeaveType;
  startDate?: Date;
  endDate?: Date;
  reason?: string;
};

export function NewRequestForm({
  onSuccess = () => { },
}: NewRequestFormProps) {
  const year = new Date().getFullYear();
  const { user } = useAuth();
  const { data, isLoading } = useLeaveBalance(year);
  const annualLeaveRemaining = data?.data?.remainingDays ?? 0;
  const createMutation = useCreateLeaveRequest();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: "ANNUAL",
      startDate: undefined,
      endDate: undefined,
      reason: "",
    },
  });

  const leaveType = watch("type");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const reason = watch("reason");

  const workingDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return differenceInBusinessDays(addDays(endDate, 1), startDate);
  }, [startDate, endDate]);

  const balanceAfter = useMemo(() => {
    if (leaveType === "SICK") return null;
    return annualLeaveRemaining - workingDays;
  }, [leaveType, annualLeaveRemaining, workingDays]);

  const isWithinBalance = leaveType === "SICK" || workingDays <= annualLeaveRemaining;

  const onSubmit = async (values: FormValues) => {
    if (!startDate || !endDate) return;

    try {
      await createMutation.mutateAsync({
        type: values.type as LeaveTypeApi,
        startDate: format(values.startDate!, "yyyy-MM-dd"),
        endDate: format(values.endDate!, "yyyy-MM-dd"),
        reason: values.reason ?? null,
      });

      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err) {
      if (err instanceof ApiException) {
        Object.entries(err.validation ?? {}).forEach(([field, messages]) => {
          setError(field as keyof FormValues, {
            type: "server",
            message: messages[0],
          });
        });

        return;
      }
      console.error(err);
    }
  };

  const handleClear = () => {
    reset({
      type: "ANNUAL",
      startDate: undefined,
      endDate: undefined,
      reason: "",
    });
  };

  if (isLoading) {
    return <LoadingCard loadingMessage="Loading balance data ..." />
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Step 1 - Select Leave Type */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground tracking-wide mb-4">
            STEP 1 — SELECT LEAVE TYPE
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Annual Leave Option */}
            <button
              onClick={() => setValue("type", "ANNUAL")}
              className={cn(
                "relative p-4 rounded-lg border-2 text-left transition-colors",
                leaveType === "ANNUAL"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-border bg-muted/30 hover:border-muted-foreground/50"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                {leaveType === "ANNUAL" ? (
                  <CheckSquare className="size-5 text-blue-500" />
                ) : (
                  <Square className="size-5 text-muted-foreground" />
                )}
                {leaveType === "ANNUAL" && (
                  <div className="size-3 rounded-sm bg-blue-500" />
                )}
              </div>
              <p className="font-medium text-foreground">Annual leave</p>
              <p className="text-sm text-muted-foreground">
                Planned time off, balance applies
              </p>
            </button>

            {/* Sick Leave Option */}
            <button
              onClick={() => setValue("type", "SICK")}
              className={cn(
                "relative p-4 rounded-lg border-2 text-left transition-colors",
                leaveType === "SICK"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-border bg-muted/30 hover:border-muted-foreground/50"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                {leaveType === "SICK" ? (
                  <CheckSquare className="size-5 text-blue-500" />
                ) : (
                  <Square className="size-5 text-muted-foreground" />
                )}
                {leaveType === "SICK" && (
                  <div className="size-3 rounded-sm bg-blue-500" />
                )}
              </div>
              <p className="font-medium text-foreground">Sick leave</p>
              <p className="text-sm text-muted-foreground">
                Illness or medical, no balance limit
              </p>
            </button>
          </div>

          {/* Balance Info */}
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-600/20 text-green-400">
            <Square className="size-4" />
            <p className="text-sm">
              You have <span className="font-semibold">{annualLeaveRemaining} days</span> of annual leave remaining in {year}. Up to {annualLeaveRemaining} days can be requested.
            </p>
          </div>
          {errors.type && (
            <p className="text-sm text-red-400 mt-1">
              {errors.type.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Step 2 - Choose Dates */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground tracking-wide mb-4">
            STEP 2 — CHOOSE DATES
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Start Date */}
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Start date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between text-left font-normal h-12 bg-muted/50",
                          !field.value && "text-muted-foreground",
                          errors.startDate && "border-red-500"
                        )}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : "Select date"}
                        <CalendarIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* End Date */}
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">End date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between text-left font-normal h-12 bg-muted/50",
                          !field.value && "text-muted-foreground",
                          errors.endDate && "border-red-500"
                        )}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : "Select date"}
                        <CalendarIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Working Days Info */}
          {startDate && endDate && (
            <div
              className={cn(
                "flex items-center gap-2 p-3 rounded-md",
                isWithinBalance
                  ? "bg-green-600/20 text-green-400"
                  : "bg-red-600/20 text-red-400"
              )}
            >
              <Square className="size-4" />
              <p className="text-sm">
                {workingDays} working days requested —{" "}
                {isWithinBalance
                  ? "within your available balance."
                  : "exceeds your available balance."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3 - Details */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground tracking-wide mb-4">
            STEP 3 — DETAILS
          </p>

          <div>
            <p className="text-sm mb-2">
              <span className="font-medium text-foreground">Reason</span>{" "}
              <span className="text-muted-foreground">
                (optional for annual, recommended for sick)
              </span>
            </p>
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Briefly describe your reason..."
                  className="min-h-25 bg-muted/50 border-border resize-none"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
      {errors.reason && (
        <p className="text-sm text-red-400 mt-1">
          {errors.reason.message}
        </p>
      )}

      {/* Summary */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-muted-foreground tracking-wide">SUMMARY</p>
            <Badge
              className={cn(
                "rounded-md",
                leaveType === "ANNUAL"
                  ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                  : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
              )}
            >
              {leaveType === "ANNUAL" ? "ANNUAL" : "SICK"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Dates</p>
              <p className="font-medium text-foreground">{formatDateRange(startDate, endDate)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Working days</p>
              <p className="font-medium text-foreground">{workingDays || "—"}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Balance after</p>
              <p
                className={cn(
                  "font-medium",
                  balanceAfter !== null && balanceAfter >= 0
                    ? "text-green-400"
                    : balanceAfter !== null
                      ? "text-red-400"
                      : "text-muted-foreground"
                )}
              >
                {balanceAfter !== null ? `${balanceAfter} days left` : "N/A"}
              </p>
            </div>
          </div>

          {/* Approval Route */}
          <div className="border-t border-border pt-4 mb-6">
            <p className="text-xs text-muted-foreground tracking-wide mb-3">
              APPROVAL ROUTE
            </p>
            <div className="space-y-2">
              {user?.manager?.name && (
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    Manager review — {user.manager.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">
                  HR final review
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {createMutation.error instanceof Error && (
              <div className="p-3 rounded-md bg-red-600/20 text-red-400 text-sm">
                {createMutation.error.message}
              </div>
            )}
            {/* {success && (
              <div className="p-3 rounded-md bg-green-600/20 text-green-400 text-sm">
                Leave request submitted successfully!
              </div>
            )} */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={!startDate || !endDate || !isWithinBalance || createMutation.isPending}
                className="bg-muted hover:bg-muted/80 text-foreground border border-border"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Submit request
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={handleClear}
                disabled={createMutation.isPending}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
