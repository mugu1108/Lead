import Link from "next/link"
import { LayoutDashboard, ListIcon, Megaphone, TrendingUp, MessageSquare } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <span className="text-xl font-bold">LeadAgent</span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <LayoutDashboard size={20} />
              <span>ダッシュボード</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-primary font-medium bg-orange-50 rounded-md"
            >
              <ListIcon size={20} />
              <span>リスト</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <Megaphone size={20} />
              <span>キャンペーン</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <TrendingUp size={20} />
              <span>アプローチ</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <MessageSquare size={20} />
              <span>メッセージ</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

