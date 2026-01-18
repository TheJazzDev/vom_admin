"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewFirstTimerDialogProps {
  firstTimer: FirstTimer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewFirstTimerDialog({
  firstTimer,
  open,
  onOpenChange,
}: ViewFirstTimerDialogProps) {
  function getStatusBadge(status: string) {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "converted":
        return <Badge className="bg-green-500">Converted</Badge>;
      case "archived":
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            First Timer Details
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Complete information about this first timer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">
              Personal Information
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    First Name
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {firstTimer.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Last Name
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {firstTimer.lastName}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Phone Number
                </p>
                <p className="text-sm font-medium sm:text-base">
                  {firstTimer.phoneNumber}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Address
                </p>
                <p className="text-sm font-medium sm:text-base">
                  {firstTimer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Visit Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">
              Visit Information
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Visit Date
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {format(new Date(firstTimer.visitDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Programme Type
                  </p>
                  <p className="text-sm font-medium capitalize sm:text-base">
                    {firstTimer.programmeType || "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Status
                </p>
                <div className="mt-1">{getStatusBadge(firstTimer.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Created
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {format(new Date(firstTimer.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Display Until
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {format(new Date(firstTimer.displayUntil), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prayer Request */}
          {firstTimer.prayerRequest && (
            <div>
              <h3 className="mb-2 text-sm font-semibold sm:mb-3 sm:text-base">
                Prayer Request
              </h3>
              <p className="text-muted-foreground rounded-md bg-muted p-3 text-xs sm:p-4 sm:text-sm">
                {firstTimer.prayerRequest}
              </p>
            </div>
          )}

          {/* Notes */}
          {firstTimer.notes && (
            <div>
              <h3 className="mb-2 text-sm font-semibold sm:mb-3 sm:text-base">
                Admin Notes
              </h3>
              <p className="text-muted-foreground rounded-md bg-muted p-3 text-xs sm:p-4 sm:text-sm">
                {firstTimer.notes}
              </p>
            </div>
          )}

          {/* Conversion Information */}
          {firstTimer.status === "converted" && (
            <div>
              <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">
                Conversion Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Converted On
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {firstTimer.convertedAt &&
                      format(
                        new Date(firstTimer.convertedAt),
                        "MMM d, yyyy h:mm a",
                      )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Member ID
                  </p>
                  <p className="font-mono text-xs sm:text-sm">
                    {firstTimer.convertedToMemberId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Follow-up */}
          {firstTimer.followedUp !== undefined && (
            <div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Follow-up Status
              </p>
              <Badge
                variant={firstTimer.followedUp ? "default" : "outline"}
                className="mt-1"
              >
                {firstTimer.followedUp ? "Followed Up" : "Pending"}
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
