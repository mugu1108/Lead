"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// カラム定義をデータ構造に合わせて修正
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "company_name",
    header: "企業名",
    cell: ({ row }) => <div>{row.getValue("company_name") || "-"}</div>,
  },
  {
    accessorKey: "industry",
    header: "業種",
    cell: ({ row }) => <div>{row.getValue("industry") || "-"}</div>,
  },
  {
    accessorKey: "contact_person",
    header: "担当者",
    cell: ({ row }) => <div>{row.getValue("contact_person") || "-"}</div>,
  },
  {
    accessorKey: "email",
    header: "メールアドレス",
    cell: ({ row }) => <div>{row.getValue("email") || "-"}</div>,
  },
  {
    accessorKey: "phone",
    header: "電話番号",
    cell: ({ row }) => <div>{row.getValue("phone") || "-"}</div>,
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {status || "処理中"}
        </div>
      );
    },
  },
  {
    accessorKey: "salesText",
    header: "営業文面",
    cell: ({ row }) => {
      const salesText = row.getValue("salesText") as string;
      return (
        <div className="max-w-[200px] truncate">
          {salesText ? salesText.slice(0, 30) + "..." : "生成中..."}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">メニューを開く</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>アクション</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>詳細を見る</DropdownMenuItem>
            <DropdownMenuItem>編集する</DropdownMenuItem>
            <DropdownMenuItem>削除する</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

