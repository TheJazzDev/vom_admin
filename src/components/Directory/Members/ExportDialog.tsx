'use client';

import { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExportMembers } from '@/hooks/useMembers';
import { toast } from 'sonner';
import { BANDS_CONFIG } from '@/constants/directory/BANDS_CONFIG';
import { DEPARTMENTS_CONFIG } from '@/constants/directory/DEPARTMENTS_CONFIG';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [filterType, setFilterType] = useState<'all' | 'band' | 'department' | 'status'>(
    'all'
  );
  const [selectedBand, setSelectedBand] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const exportMembers = useExportMembers();

  const handleExport = async () => {
    try {
      const filters: any = {};

      if (filterType === 'band' && selectedBand) {
        filters.band = selectedBand;
      } else if (filterType === 'department' && selectedDepartment) {
        filters.department = selectedDepartment;
      } else if (filterType === 'status' && selectedStatus) {
        filters.status = selectedStatus;
      }

      await exportMembers.mutateAsync(filters);
      toast.success('Members exported successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export members');
    }
  };

  const handlePrint = () => {
    onOpenChange(false);
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Members</DialogTitle>
          <DialogDescription>
            Choose export options and download as CSV or print
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Filter Type Selection */}
          <div className="grid gap-2">
            <Label>Filter By</Label>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="band">Band</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Band Selection */}
          {filterType === 'band' && (
            <div className="grid gap-2">
              <Label>Select Band</Label>
              <Select value={selectedBand} onValueChange={setSelectedBand}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a band" />
                </SelectTrigger>
                <SelectContent>
                  {BANDS_CONFIG.map((band) => (
                    <SelectItem key={band.id} value={band.id}>
                      {band.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Department Selection */}
          {filterType === 'department' && (
            <div className="grid gap-2">
              <Label>Select Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS_CONFIG.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status Selection */}
          {filterType === 'status' && (
            <div className="grid gap-2">
              <Label>Select Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Export Summary:
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {filterType === 'all' && 'All members will be exported'}
              {filterType === 'band' &&
                (selectedBand
                  ? `Members in ${BANDS_CONFIG.find((b) => b.id === selectedBand)?.displayName} band`
                  : 'Please select a band')}
              {filterType === 'department' &&
                (selectedDepartment
                  ? `Members in ${DEPARTMENTS_CONFIG.find((d) => d.id === selectedDepartment)?.displayName} department`
                  : 'Please select a department')}
              {filterType === 'status' &&
                (selectedStatus
                  ? `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} members only`
                  : 'Please select a status')}
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
          <Button
            type="button"
            onClick={handleExport}
            disabled={
              exportMembers.isPending ||
              (filterType === 'band' && !selectedBand) ||
              (filterType === 'department' && !selectedDepartment) ||
              (filterType === 'status' && !selectedStatus)
            }
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {exportMembers.isPending ? 'Exporting...' : 'Export CSV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
