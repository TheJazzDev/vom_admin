import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

const TableTitleAndFilters = ({ table }: { table: any }) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="view-selector" className="sr-only">
        View
      </Label>
      <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
        <Users className="h-5 w-5" />
        Members List
      </CardTitle>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TableTitleAndFilters;
