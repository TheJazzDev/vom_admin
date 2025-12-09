import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMemberForm } from "../Edit/Form";

const ActionsCell = ({ row }: { row: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditMemberForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        item={row.original}
      />
    </>
  );
};

// Custom filter functions
const bandFilterFn = (row: any, columnId: string, filterValue: string) => {
  const bands: BandData[] = row.getValue(columnId) || [];
  return bands.some((band) => band.name === filterValue);
};

const departmentFilterFn = (
  row: any,
  columnId: string,
  filterValue: string,
) => {
  const departments: DepartmentData[] = row.getValue(columnId) || [];
  return departments.some((dept) => dept.name === filterValue);
};

const verifiedFilterFn = (
  row: any,
  _columnId: string,
  filterValue: boolean,
) => {
  const verified = row.original.verified;
  return verified === filterValue;
};

const exactMatchFilterFn = (
  row: any,
  columnId: string,
  filterValue: string,
) => {
  const cellValue = row.getValue(columnId);
  return String(cellValue).toLowerCase() === String(filterValue).toLowerCase();
};

export const columns: ColumnDef<UserProfile>[] = [
  {
    id: "serial",
    header: () => <p className="pl-2">Serial</p>,
    cell: ({ row }) => <p className="pl-4">{row.index + 1}</p>,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <p>{row.original.title}</p>,
  },
  {
    accessorKey: "firstName",
    header: "First name",
    cell: ({ row }) => <p>{row.original.firstName}</p>,
    enableHiding: false,
    enableGlobalFilter: true, // Enable search
  },
  {
    accessorKey: "lastName",
    header: "Last name",
    cell: ({ row }) => <p>{row.original.lastName}</p>,
    enableHiding: false,
    enableGlobalFilter: true, // Enable search
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <p>{row.original.email}</p>,
    enableGlobalFilter: true, // Enable search
  },
  {
    accessorKey: "primaryPhone",
    header: "Primary phone",
    cell: ({ row }) => <p>{row.original.primaryPhone}</p>,
    enableGlobalFilter: true, // Enable search
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <p className="capitalize">{row.original.gender}</p>,
    filterFn: exactMatchFilterFn, // Use exact match for filtering
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.verified ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.verified ? "Verified" : "Unverified"}
      </Badge>
    ),
    filterFn: exactMatchFilterFn, // Use exact match for filtering
  },

  // HIDDEN COLUMNS - Used only for filtering, not displayed in table
  {
    accessorKey: "verified",
    header: "Verified Status",
    cell: ({ row }) => <span>{row.getValue("verified") ? "Yes" : "No"}</span>,
    filterFn: verifiedFilterFn,
    enableHiding: true,
    // This column will be hidden by default in the table component
  },
  {
    accessorKey: "maritalStatus",
    header: "Marital Status",
    cell: ({ row }) => {
      const status = row.getValue("maritalStatus") as string;
      return <span className="capitalize">{status || "N/A"}</span>;
    },
    filterFn: exactMatchFilterFn,
    enableHiding: true,
    // This column will be hidden by default in the table component
  },
  {
    accessorKey: "band",
    header: "Bands",
    cell: ({ row }) => {
      const bands = row.getValue("band") as BandData[];
      if (!bands || bands.length === 0) return <span>-</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {bands?.map((band, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
            >
              {band.name}
            </span>
          ))}
        </div>
      );
    },
    filterFn: bandFilterFn,
    enableHiding: true,
    // This column will be hidden by default in the table component
  },
  {
    accessorKey: "department",
    header: "Departments",
    cell: ({ row }) => {
      const departments = row.getValue("department") as DepartmentData[];
      if (!departments || departments.length === 0) return <span>-</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {departments?.map((dept, idx) => (
            <span
              key={idx}
              className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded"
            >
              {dept.name}
            </span>
          ))}
        </div>
      );
    },
    filterFn: departmentFilterFn,
    enableHiding: true,
    // This column will be hidden by default in the table component
  },

  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
    enableHiding: false,
  },
];
