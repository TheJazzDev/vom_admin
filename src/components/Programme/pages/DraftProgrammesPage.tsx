"use client";

import { FileText, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDraftProgrammes } from "@/hooks/useProgrammes";
import { ProgrammeCard } from "../Components/ProgrammeCard";
import { ProgrammeListSkeleton } from "../Components/Skeletons/ProgrammeCardSkeleton";

const DraftProgrammesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { data: programmes, isLoading, error } = useDraftProgrammes();

  const filteredProgrammes = programmes?.filter((programme) => {
    const matchesSearch =
      programme.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.theme.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Draft Programmes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and edit draft programmes before publishing
          </p>
        </div>
        <Button
          onClick={() => router.push("/programmes/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Programme
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search draft programmes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <ProgrammeListSkeleton />
      ) : error ? (
        <Card className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                Error Loading Drafts
              </h3>
              <p className="text-red-600 dark:text-red-400">
                {error.message || "Failed to load draft programmes"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgrammes && filteredProgrammes.length > 0 ? (
            filteredProgrammes.map((programme) => (
              <ProgrammeCard key={programme.id} programme={programme} />
            ))
          ) : (
            <div className="col-span-full">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No Draft Programmes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchTerm
                        ? "No drafts match your search criteria."
                        : "You have no draft programmes. Create one to get started."}
                    </p>
                    <Button
                      onClick={() => router.push("/programme/create")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DraftProgrammesPage;
