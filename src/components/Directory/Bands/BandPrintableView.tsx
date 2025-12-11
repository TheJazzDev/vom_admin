"use client";

import { format } from "date-fns";

interface BandPrintableViewProps {
  bandName: string;
  bandDescription?: string;
  members: any[];
}

export function BandPrintableView({
  bandName,
  bandDescription,
  members,
}: BandPrintableViewProps) {
  return (
    <div className="print-content hidden print:block">
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold mb-2">Valley of Mercy Church</h1>
        <h2 className="text-xl">{bandName} Band - Member List</h2>
        {bandDescription && (
          <p className="text-sm text-gray-600 mt-1">{bandDescription}</p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Generated on {format(new Date(), "MMMM dd, yyyy")} at{" "}
          {format(new Date(), "hh:mm a")}
        </p>
        <p className="text-sm font-medium mt-1">
          Total Members: {members.length}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="stats-card">
          <p className="text-xs text-gray-600">Total Members</p>
          <p className="text-lg font-bold">{members.length}</p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-gray-600">Active</p>
          <p className="text-lg font-bold">
            {members.filter((m) => m.status === "active").length}
          </p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-gray-600">Inactive</p>
          <p className="text-lg font-bold">
            {members.filter((m) => m.status === "inactive").length}
          </p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-gray-600">Leadership</p>
          <p className="text-lg font-bold">
            {
              members.filter(
                (m) =>
                  m.band?.[0]?.role?.toLowerCase().includes("captain") ||
                  m.band?.[0]?.role?.toLowerCase().includes("secretary"),
              ).length
            }
          </p>
        </div>
      </div>

      {/* Members Table */}
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">#</th>
            <th className="text-left">Title</th>
            <th className="text-left">First Name</th>
            <th className="text-left">Last Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Phone</th>
            <th className="text-left">Role</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.id}>
              <td>{index + 1}</td>
              <td>{member.title}</td>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td className="text-xs">{member.email}</td>
              <td className="text-xs">{member.primaryPhone}</td>
              <td className="text-xs">{member.band?.[0]?.role || "Member"}</td>
              <td className="text-xs capitalize">{member.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-400 text-center text-xs text-gray-600">
        <p>Valley of Mercy Church - {bandName} Band Directory</p>
        <p>This document is confidential and for internal use only</p>
      </div>

      <style jsx global>{`
        @media print {
          .print-content {
            display: block !important;
          }

          body * {
            visibility: hidden;
          }

          .print-content,
          .print-content * {
            visibility: visible;
          }

          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 10px;
          }

          th,
          td {
            border: 1px solid #ddd;
            padding: 6px;
          }

          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }

          .stats-card {
            border: 1px solid #ddd;
            padding: 8px;
            border-radius: 4px;
            background-color: #f9fafb;
          }
        }
      `}</style>
    </div>
  );
}
