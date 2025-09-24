import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMemberForm } from "../EditMember/Form";
import type { tableSchema } from "../Schemas/tableSchema";

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

export const columns: ColumnDef<z.infer<typeof tableSchema>>[] = [
  {
    id: "serial",
    header: () => <p>Serial</p>,
    cell: ({ row }) => <p>{row.index}</p>,
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
  },
  {
    accessorKey: "lastName",
    header: "Last name",
    cell: ({ row }) => <p>{row.original.lastName}</p>,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <p>{row.original.email}</p>,
  },
  {
    accessorKey: "primaryPhone",
    header: "Primary phone",
    cell: ({ row }) => <p>{row.original.primaryPhone}</p>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <p className="capitalize">{row.original.gender}</p>,
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
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
