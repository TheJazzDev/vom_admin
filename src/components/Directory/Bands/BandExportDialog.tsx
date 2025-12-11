"use client";

import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BandExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bandName: string;
  members: any[];
}

export function BandExportDialog({
  open,
  onOpenChange,
  bandName,
  members,
}: BandExportDialogProps) {
  const handleExport = () => {
    try {
      // Prepare CSV data
      const headers = [
        "Title",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Role",
        "Status",
      ];

      const csvData = members.map((member) => [
        member.title || "",
        member.firstName || "",
        member.lastName || "",
        member.email || "",
        member.primaryPhone || "",
        member.band?.[0]?.role || "",
        member.status || "",
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${bandName.replace(/\s+/g, "_")}_members_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Band members exported successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export band members");
    }
  };

  const handlePrint = () => {
    onOpenChange(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export {bandName} Members</DialogTitle>
          <DialogDescription>
            Download as CSV or print the member list
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Export Summary:
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {members.length} member{members.length !== 1 ? "s" : ""} in{" "}
              {bandName} band
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button type="button" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
