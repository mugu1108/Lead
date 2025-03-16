import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 400 })
    }

    // ファイル名の生成
    const fileId = uuidv4()
    const fileName = `${fileId}-${file.name}`

    // ファイルの保存先パス
    // 注: 実際の本番環境では一時ディレクトリやクラウドストレージを使用すべき
    const uploadDir = join(process.cwd(), "uploads")
    const filePath = join(uploadDir, fileName)

    // ファイルをバイナリデータとして読み込む
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // ファイルを保存
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      fileId,
      fileName,
    })
  } catch (error) {
    console.error("ファイルアップロードエラー:", error)
    return NextResponse.json({ error: "ファイルのアップロードに失敗しました" }, { status: 500 })
  }
}

