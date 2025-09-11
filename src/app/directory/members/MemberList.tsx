"use client";

import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/Directory/Members/Table/MemberTable";
import { useMembers } from "@/hooks/useMembers";

const MembersList = () => {
  const { data: members, isLoading } = useMembers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading members...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DataTable data={members || []} />
    </div>
  );
};

export default MembersList;
