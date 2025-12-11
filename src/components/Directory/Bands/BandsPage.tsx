"use client";

import { Filter, Music, Plus, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAllBands } from "@/hooks/useBands";
import { BandCard } from "./Components/BandCard";
import { BandCardSkeleton } from "./Components/BandCardSkeleton";

const BandsPage = () => {
  const { data: bandsData, isLoading } = useAllBands();

  const totalMembers =
    bandsData?.reduce((sum, band) => sum + band.memberCount, 0) || 0;

  const totalBands = isLoading ? 0 : bandsData && bandsData.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Bands Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage church bands, their members, and leadership structure
            </p>
          </div>
          <div className="flex">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Band
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Bands
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {totalBands}
                  </p>
                </div>
                <Music className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Members
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {totalMembers}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Across all bands
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bands Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Church Bands
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <BandCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bandsData?.map((band) => (
                <Link
                  key={band.id}
                  href={`/directory/bands/${band.id.toLowerCase()}`}
                >
                  <BandCard band={band} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BandsPage;
