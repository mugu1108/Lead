import { Sidebar } from "@/components/sidebar"
import { ListUpload } from "@/components/list-upload"

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">リスト</h1>
        <ListUpload />
      </main>
    </div>
  )
}

