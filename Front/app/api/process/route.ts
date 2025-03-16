import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// サンプルデータ生成関数
function generateSampleData() {
  const industries = ["IT", "製造業", "小売", "金融", "医療", "教育", "不動産"]
  const statuses = ["pending", "processed", "error"]

  return Array.from({ length: 20 }, (_, i) => ({
    id: uuidv4(),
    companyName: `サンプル企業${i + 1}`,
    industry: industries[Math.floor(Math.random() * industries.length)],
    contactPerson: `担当者${i + 1}`,
    email: `contact${i + 1}@example.com`,
    phone: `03-1234-${5678 + i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }))
}

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json()

    if (!filename) {
      return NextResponse.json({ error: "ファイル名が指定されていません" }, { status: 400 })
    }

    // 実際のアプリケーションではここでファイルを処理する
    // このサンプルではダミーデータを返す
    const data = generateSampleData()

    // 処理に少し時間がかかるシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("データ処理エラー:", error)
    return NextResponse.json({ error: "データの処理に失敗しました" }, { status: 500 })
  }
}

