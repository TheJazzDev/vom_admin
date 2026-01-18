"use client";

import { format } from "date-fns";
import { Archive, Eye, MoreHorizontal, UserPlus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PromoteToMemberDialog } from "./PromoteToMemberDialog";
import { ViewFirstTimerDialog } from "./ViewFirstTimerDialog";

interface FirstTimersTableProps {
  firstTimers: FirstTimer[];
  loading: boolean;
  onArchive: (id: string) => void;
  onRefresh: () => void;
}

export function FirstTimersTable({
  firstTimers,
  loading,
  onArchive,
  onRefresh,
}: FirstTimersTableProps) {
  const [selectedFirstTimer, setSelectedFirstTimer] =
    useState<FirstTimer | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  function handlePromote(firstTimer: FirstTimer) {
    setSelectedFirstTimer(firstTimer);
    setPromoteDialogOpen(true);
  }

  function handleView(firstTimer: FirstTimer) {
    setSelectedFirstTimer(firstTimer);
    setViewDialogOpen(true);
  }

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

  if (loading) {
    return (
      <div className="text-center p-4 sm:p-8">Loading first timers...</div>
    );
  }

  if (firstTimers.length === 0) {
    return (
      <div className="text-center p-4 sm:p-8">
        <p className="text-muted-foreground text-sm sm:text-base">
          No first timers yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="text-xs sm:text-sm">Phone</TableHead>
              <TableHead className="text-xs sm:text-sm">Visit Date</TableHead>
              <TableHead className="text-xs sm:text-sm">Programme</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-xs sm:text-sm">Created</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {firstTimers.map((firstTimer) => (
              <TableRow key={firstTimer.id}>
                <TableCell className="font-medium text-xs sm:text-sm">
                  {firstTimer.firstName} {firstTimer.lastName}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {firstTimer.phoneNumber}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {format(new Date(firstTimer.visitDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {firstTimer.programmeType && (
                    <Badge variant="outline" className="text-xs">
                      {firstTimer.programmeType}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(firstTimer.status)}</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {format(new Date(firstTimer.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(firstTimer)}>
                        <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">View Details</span>
                      </DropdownMenuItem>
                      {firstTimer.status === "active" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handlePromote(firstTimer)}
                          >
                            <UserPlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">
                              Promote to Member
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onArchive(firstTimer.id)}
                          >
                            <Archive className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Archive</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedFirstTimer && (
        <>
          <PromoteToMemberDialog
            firstTimer={selectedFirstTimer}
            open={promoteDialogOpen}
            onOpenChange={setPromoteDialogOpen}
            onSuccess={onRefresh}
          />
          <ViewFirstTimerDialog
            firstTimer={selectedFirstTimer}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
        </>
      )}
    </>
  );
}
