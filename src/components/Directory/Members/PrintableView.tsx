'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';

interface PrintableViewProps {
  members: UserProfile[];
  filterType?: string;
  filterValue?: string;
}

export function PrintableView({ members, filterType, filterValue }: PrintableViewProps) {
  const filteredMembers = members;

  const title = useMemo(() => {
    if (filterType === 'all' || !filterType) return 'All Members Directory';
    if (filterType === 'band') return `${filterValue} Band Members`;
    if (filterType === 'department') return `${filterValue} Department Members`;
    if (filterType === 'status')
      return `${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)} Members`;
    return 'Members Directory';
  }, [filterType, filterValue]);

  return (
    <div className="print-content hidden print:block">
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold mb-2">Valley of Mercy Church</h1>
        <h2 className="text-xl">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">
          Generated on {format(new Date(), 'MMMM dd, yyyy')} at{' '}
          {format(new Date(), 'hh:mm a')}
        </p>
        <p className="text-sm font-medium mt-1">Total Members: {filteredMembers.length}</p>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="stats-card">
          <p className="text-xs text-gray-600">Active</p>
          <p className="text-lg font-bold">
            {filteredMembers.filter((m) => m.status === 'active').length}
          </p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-gray-600">Inactive</p>
          <p className="text-lg font-bold">
            {filteredMembers.filter((m) => m.status === 'inactive').length}
          </p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-gray-600">Male</p>
          <p className="text-lg font-bold">
            {filteredMembers.filter((m) => m.gender === 'male').length}
          </p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-gray-600">Female</p>
          <p className="text-lg font-bold">
            {filteredMembers.filter((m) => m.gender === 'female').length}
          </p>
        </div>
      </div>

      {/* Members Table */}
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">#</th>
            <th className="text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Phone</th>
            <th className="text-left">Band</th>
            <th className="text-left">Department</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => (
            <tr key={member.id}>
              <td>{index + 1}</td>
              <td>
                {member.title} {member.firstName} {member.lastName}
              </td>
              <td className="text-xs">{member.email}</td>
              <td className="text-xs">{member.primaryPhone}</td>
              <td className="text-xs">
                {member.band?.map((b) => b.name).join(', ') || 'N/A'}
              </td>
              <td className="text-xs">
                {member.department?.map((d) => d.name).join(', ') || 'N/A'}
              </td>
              <td className="text-xs capitalize">{member.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-400 text-center text-xs text-gray-600">
        <p>Valley of Mercy Church - Members Directory</p>
        <p>This document is confidential and for internal use only</p>
      </div>
    </div>
  );
}
