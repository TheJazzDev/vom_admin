"use client";

import { Download, UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { Atom } from "react-loading-indicators";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BandKeys } from "@/enums";
import { useMembersByBand } from "@/hooks/useBands";

const getBandKeyFromParam = (
  param: string | undefined,
): BandKeys | undefined => {
  if (!param) return undefined;
  return Object.values(BandKeys).find(
    (bandKey) => bandKey.toLowerCase() === param.toLowerCase(),
  );
};

const BandDetailsPage = () => {
  const params = useParams();
  const bandKey = getBandKeyFromParam(params.band as string);

  const { data, isLoading } = useMembersByBand(bandKey as BandKeys);
  const bandData = data || {
    members: [],
    meta: {
      name: params.band,
      description: `Loading ${params.band} data...`,
      gradient: ["#000", "#111"],
      icon: () => null,
    },
  };

  const Icon = bandData.meta.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Band Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
              style={{
                background: `linear-gradient(135deg, ${bandData.meta.gradient[0]}, ${bandData.meta.gradient[1]})`,
              }}
            >
              <Icon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                {bandData.meta.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {bandData.meta.description}
              </p>
            </div>
          </div>
          {!isLoading && (
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          )}
        </div>

        {/* 🔹 Members Table */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Band Members ({bandData.members.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center">
              <Atom
                color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                size="large"
                text=""
                textColor="green"
              />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>First name</TableHead>
                    <TableHead>Last name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bandData.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.title}</TableCell>
                      <TableCell>{member.firstName}</TableCell>
                      <TableCell>{member.lastName}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.primaryPhone}</TableCell>
                      <TableCell>{member.band[0].role}</TableCell>
                      <TableCell>
                        {member.status === "active" ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BandDetailsPage;
