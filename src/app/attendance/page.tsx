'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AttendanceForm } from '@/components/Attendance/AttendanceForm';
import { AttendanceStats } from '@/components/Attendance/AttendanceStats';
import { Plus, Users, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchRecords();
  }, [refreshTrigger]);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/attendance');
      const result = await response.json();
      if (result.success) {
        setRecords(result.records);
      }
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getServiceTypeBadgeVariant = (serviceType: ServiceType) => {
    switch (serviceType) {
      case 'Sunday Service':
        return 'default';
      case 'Midweek Service':
        return 'secondary';
      case 'Special Event':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Attendance Tracking</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Record and monitor church service attendance
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Record Attendance
        </Button>
      </div>

      {/* Stats */}
      <AttendanceStats refreshTrigger={refreshTrigger} />

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            View all recorded attendance for services and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading records...</p>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No attendance records yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by recording your first attendance
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Record Attendance
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead className="text-right">Male Adults</TableHead>
                    <TableHead className="text-right">Female Adults</TableHead>
                    <TableHead className="text-right">Children</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {formatDate(record.date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getServiceTypeBadgeVariant(record.serviceType)}>
                          {record.serviceType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{record.maleAdults}</TableCell>
                      <TableCell className="text-right">{record.femaleAdults}</TableCell>
                      <TableCell className="text-right">{record.children}</TableCell>
                      <TableCell className="text-right font-medium">
                        {record.total}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.recordedByName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Form Dialog */}
      <AttendanceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
