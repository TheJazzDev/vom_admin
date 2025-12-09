import {
  IconChevronDown,
  IconFilter,
  IconLayoutColumns,
  IconSortAscending,
  IconSortDescending,
  IconX,
} from "@tabler/icons-react";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BandKeysEnum, DepartmentKeysEnum } from "@/enums";

const TableTitleAndFilters = ({ table }: { table: any }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [bandFilter, setBandFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [maritalStatusFilter, setMaritalStatusFilter] = useState<string>("all");

  // Sorting states
  const [sortBy, setSortBy] = useState<string>("serial");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  // Get active filter count
  const activeFilterCount = [
    searchTerm,
    statusFilter !== "all" ? statusFilter : null,
    genderFilter !== "all" ? genderFilter : null,
    bandFilter !== "all" ? bandFilter : null,
    departmentFilter !== "all" ? departmentFilter : null,
    verificationFilter !== "all" ? verificationFilter : null,
    maritalStatusFilter !== "all" ? maritalStatusFilter : null,
  ].filter(Boolean).length;

  // Apply sorting
  useEffect(() => {
    table.setSorting([
      {
        id: sortBy,
        desc: sortOrder === "desc",
      },
    ]);
  }, [sortBy, sortOrder, table]);

  // Apply all filters together
  useEffect(() => {
    const filters: any[] = [];

    // Status filter
    if (statusFilter !== "all") {
      filters.push({
        id: "status",
        value: statusFilter,
      });
    }

    // Gender filter
    if (genderFilter !== "all") {
      filters.push({
        id: "gender",
        value: genderFilter,
      });
    }

    // Band filter
    if (bandFilter !== "all") {
      filters.push({
        id: "band",
        value: bandFilter,
      });
    }

    // Department filter
    if (departmentFilter !== "all") {
      filters.push({
        id: "department",
        value: departmentFilter,
      });
    }

    // Verification filter
    if (verificationFilter !== "all") {
      filters.push({
        id: "verified",
        value: verificationFilter === "verified",
      });
    }

    // Marital status filter
    if (maritalStatusFilter !== "all") {
      filters.push({
        id: "maritalStatus",
        value: maritalStatusFilter,
      });
    }

    // Apply column filters
    table.setColumnFilters(filters);

    // Apply global search separately
    if (searchTerm) {
      table.setGlobalFilter(searchTerm);
    } else {
      table.setGlobalFilter("");
    }
  }, [
    searchTerm,
    statusFilter,
    genderFilter,
    bandFilter,
    departmentFilter,
    verificationFilter,
    maritalStatusFilter,
    table,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setGenderFilter("all");
    setBandFilter("all");
    setDepartmentFilter("all");
    setVerificationFilter("all");
    setMaritalStatusFilter("all");
    table.setGlobalFilter("");
    table.setColumnFilters([]);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Sort options
  const sortOptions = [
    { value: "serial", label: "Serial No" },
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "email", label: "Email" },
    { value: "title", label: "Title" },
    { value: "dob", label: "Date of Birth" },
    { value: "joinDate", label: "Join Date" },
    { value: "createdAt", label: "Date Added" },
    { value: "gender", label: "Gender" },
    { value: "maritalStatus", label: "Marital Status" },
    { value: "status", label: "Status" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Users className="h-5 w-5" />
          Members List
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Sort Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortOrder === "asc" ? (
                  <IconSortAscending className="h-4 w-4" />
                ) : (
                  <IconSortDescending className="h-4 w-4" />
                )}
                <span className="hidden lg:inline">Sort</span>
                <IconChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={(value: string) => setSortOrder(value)}
              >
                <DropdownMenuRadioItem value="asc">
                  <IconSortAscending className="h-4 w-4 mr-2" />
                  Ascending (A-Z, 0-9)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">
                  <IconSortDescending className="h-4 w-4 mr-2" />
                  Descending (Z-A, 9-0)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <IconFilter className="h-4 w-4" />
            <span className="hidden lg:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="h-4 w-4" />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column: any) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column: any) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/([A-Z])/g, " $1").trim()}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Current Sort Display */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          {sortOrder === "asc" ? (
            <IconSortAscending className="h-4 w-4" />
          ) : (
            <IconSortDescending className="h-4 w-4" />
          )}
          Sorted by:{" "}
          <span className="font-medium text-foreground">
            {sortOptions.find((opt) => opt.value === sortBy)?.label}
          </span>
          ({sortOrder === "asc" ? "A-Z" : "Z-A"})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSortOrder}
          className="h-6 px-2"
        >
          <IconX className="h-3 w-3 mr-1" />
          Reverse
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-muted/50 border rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Gender</Label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Verification Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Verification</Label>
              <Select
                value={verificationFilter}
                onValueChange={setVerificationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Marital Status</Label>
              <Select
                value={maritalStatusFilter}
                onValueChange={setMaritalStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Band Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Band</Label>
              <Select value={bandFilter} onValueChange={setBandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Bands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bands</SelectItem>
                  {Object.values(BandKeysEnum).map((band) => (
                    <SelectItem key={band} value={band}>
                      {band}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Department</Label>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {Object.values(DepartmentKeysEnum).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters & Clear Button */}
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
                  active
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-destructive hover:text-destructive"
              >
                <IconX className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableTitleAndFilters;
