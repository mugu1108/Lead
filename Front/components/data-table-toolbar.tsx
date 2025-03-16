import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="企業名で検索..."
          value={(table.getColumn("company_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("company_name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        {table.getColumn("industry") && (
          <Select
            value={(table.getColumn("industry")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("industry")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="業種" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">すべて</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="製造業">製造業</SelectItem>
              <SelectItem value="小売">小売</SelectItem>
              <SelectItem value="サービス">サービス</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            フィルタをリセット
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 