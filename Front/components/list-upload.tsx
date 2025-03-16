"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, AlertCircle, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"

// 環境変数からAPIのベースURLを取得
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// APIレスポンスの詳細なデバッグ
console.log("API URL:", apiUrl)
console.log("環境変数:", process.env)

export function ListUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [lastApiResponse, setLastApiResponse] = useState<any | null>(null)

  const router = useRouter()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setError(null)
    setIsUploading(true)
    
    try {
      // FormDataの作成
      const formData = new FormData()
      formData.append("file", file)
      
      // ファイルのアップロード
      const uploadResponse = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      })
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.detail || "ファイルのアップロードに失敗しました")
      }
      
      const uploadResult = await uploadResponse.json()
      console.log("アップロードレスポンス:", uploadResult)
      
      setIsUploading(false)
      setIsProcessing(true)
      
      // データの処理
      const processResponse = await fetch(`${apiUrl}/api/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: uploadResult.file_id }),
      })
      
      if (!processResponse.ok) {
        const errorData = await processResponse.json()
        throw new Error(errorData.detail || "ファイルの処理に失敗しました")
      }
      
      const result = await processResponse.json()
      console.log("バックエンドからの生データ:", result)
      
      if (result.data && Array.isArray(result.data)) {
        console.log("データ配列を確認:", result.data)
        const transformedData = transformDataForFrontend(result.data)
        console.log("変換後のデータ:", transformedData)
        setData(transformedData)
        
        // SSE接続を開始して営業文面のリアルタイム更新を受け取る
        setupSSEConnection(uploadResult.file_id)
      } else {
        console.error("不正なデータ形式:", result)
        throw new Error("データの形式が不正です")
      }
      
      setIsProcessing(false)
      setLastApiResponse(result)
    } catch (err: any) {
      setIsUploading(false)
      setIsProcessing(false)
      setError(err.message || "エラーが発生しました")
    }
  }

  // ファイル処理後のSSE接続設定
  const setupSSEConnection = (fileId: string) => {
    console.log("SSE接続を開始します:", `${apiUrl}/api/sales-text-stream?list_id=${fileId}`)
    const eventSource = new EventSource(`${apiUrl}/api/sales-text-stream?list_id=${fileId}`)

    eventSource.onmessage = (event) => {
      console.log("SSEメッセージを受信:", event.data)
      
      try {
        const data = JSON.parse(event.data)
        console.log("解析されたSSEデータ:", data)
        
        // 終了メッセージの確認
        if (data.status === "done") {
          console.log("SSE接続を終了します")
          eventSource.close()
          return
        }
        
        // エラーメッセージの確認
        if (data.error) {
          console.error("SSEエラー:", data.error)
          setError(data.error)
          return
        }
        
        // 通常のデータ処理
        setData(currentData => {
          console.log("現在のデータ:", currentData, "更新対象ID:", data.id)
          return currentData.map(row => {
            if (row.id === data.id) {
              console.log("データを更新:", row.id)
              return { ...row, salesText: data.text, status: "完了" }
            }
            return row
          })
        })
      } catch (err) {
        console.error("SSEデータの解析エラー:", err, "データ:", event.data)
      }
    }

    eventSource.onerror = (err) => {
      console.error("SSE接続エラー:", err)
      eventSource.close()
    }

    // コンポーネントのクリーンアップ時にSSE接続を閉じる
    return () => {
      console.log("SSE接続をクリーンアップします")
      eventSource.close()
    }
  }

  const loadTestData = async () => {
    try {
      setError(null)
      setIsProcessing(true)
      
      const response = await fetch(`${apiUrl}/api/test-data`)
      
      if (!response.ok) {
        throw new Error("テストデータの取得に失敗しました")
      }
      
      const result = await response.json()
      console.log("テストデータレスポンス:", result)
      
      if (result.data) {
        setData(result.data)
        
        // SSE接続の開始（テスト用）
        setupSSEConnection("current")
      } else {
        throw new Error("テストデータが見つかりません")
      }
      
      setIsProcessing(false)
    } catch (err: any) {
      setIsProcessing(false)
      setError(err.message || "エラーが発生しました")
    }
  }

  // エラー表示コンポーネント
  const ErrorMessage = () => {
    if (!error) return null
    
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">エラー</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          className="absolute top-0 right-0 px-4 py-3"
          onClick={() => setError(null)}
        >
          <span className="text-red-500">×</span>
        </button>
      </div>
    )
  }

  // データの状態表示を改善
  const getStatusBadge = (status: string | null) => {
    if (!status) return "未処理"
    return status
  }

  // 営業文面の状態表示を改善
  const getSalesTextStatus = (text: string | null) => {
    if (!text) return "生成中..."
    return text.substring(0, 20) + "..."
  }

  // DataTableコンポーネントにデータを渡す前に加工
  const processedData = data || []

  // バックエンドのデータをフロントエンド用に変換する関数
  const transformDataForFrontend = (backendData: any[]) => {
    console.log("変換前のデータ:", backendData)
    
    // データが配列でない場合は空配列を返す
    if (!Array.isArray(backendData)) {
      console.error("データが配列ではありません:", backendData)
      return []
    }
    
    const transformed = backendData.map(item => {
      // nullの場合は空文字列に変換
      const result = {
        id: item.id || Math.random().toString(36).substring(2, 9),
        company_name: item.company_name || "",
        industry: item.industry || "",
        contact_person: item.contact_person || "",
        email: item.email || "",
        phone: item.phone || "",
        address: item.address || "",
        url: item.url || "",
        employee_count: item.employee_count || "",
        revenue: item.revenue || "",
        established_year: item.established_year || "",
        status: item.status || "処理中",
        salesText: item.salesText || ""
      }
      console.log("変換アイテム:", item, "→", result)
      return result
    })
    
    console.log("変換後のデータ:", transformed)
    return transformed
  }

  // サンプルCSVをダウンロードする関数
  const downloadSampleCSV = () => {
    const sampleData = `会社名,業種,担当者,メールアドレス,電話番号,住所,URL,従業員数,売上,設立年
テスト株式会社,IT,山田太郎,test@example.com,03-1234-5678,東京都渋谷区,https://example.com,100,500,2010
サンプル商事,製造業,佐藤次郎,sample@example.com,03-8765-4321,大阪府大阪市,https://sample.com,50,300,2005`
    
    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_company_data.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // エクスポート機能の実装
  const handleExport = async (format: "csv" | "excel") => {
    try {
      setIsExporting(true)
      
      // リストIDがある場合はクエリパラメータに追加
      const listId = "current" // 実際の実装ではリストIDを使用
      
      // ファイルのダウンロード
      const response = await fetch(`${apiUrl}/api/export?list_id=${listId}&format=${format}`, {
        method: "GET",
      })
      
      if (!response.ok) {
        throw new Error(`エクスポートに失敗しました: ${response.statusText}`)
      }
      
      // レスポンスをBlobとして取得
      const blob = await response.blob()
      
      // ダウンロード用のリンクを作成
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      const filename = `営業リスト_${new Date().toISOString().slice(0, 10)}`
      a.href = url
      a.download = `${filename}.${format}`
      document.body.appendChild(a)
      a.click()
      
      // クリーンアップ
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setIsExporting(false)
    } catch (err: any) {
      setError(err.message || "エクスポート中にエラーが発生しました")
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ErrorMessage />

      {isProcessing && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>処理中</AlertTitle>
          <AlertDescription>データを処理しています。しばらくお待ちください...</AlertDescription>
        </Alert>
      )}

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">リスト一覧</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadTestData}>
              テストデータ表示
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>アップロード</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>アップロード</DialogTitle>
                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    以下の情報を含むCSVまたはExcelファイルをアップロードしてください：
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                    <li>会社名（必須）</li>
                    <li>業種</li>
                    <li>担当者名</li>
                    <li>メールアドレス</li>
                    <li>電話番号</li>
                    <li>住所</li>
                    <li>URL</li>
                  </ul>

                  <Tabs defaultValue="file">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="file">ファイルから選択</TabsTrigger>
                      <TabsTrigger value="sfa">SFAから選択</TabsTrigger>
                    </TabsList>
                    <TabsContent value="file" className="mt-4">
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center ${
                          isDragging ? "border-primary bg-primary/5" : "border-gray-300"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <Upload className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium">ファイルをドラッグしてアップロードする</p>
                          <p className="text-xs text-muted-foreground">OR</p>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md">
                              ファイルを選択
                            </div>
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept=".csv,.xlsx,.xls"
                              onChange={handleFileChange}
                            />
                          </label>
                          {file && <div className="mt-2 text-sm">選択されたファイル: {file.name}</div>}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="sfa">
                      <div className="h-40 flex items-center justify-center border rounded-lg">
                        <p className="text-muted-foreground">SFA連携は準備中です</p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">キャンセル</Button>
                    </DialogClose>
                    <Button onClick={handleUpload} disabled={!file || isUploading}>
                      {isUploading ? <>処理中...</> : <>データ取得開始</>}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {data && data.length > 0 ? (
          <div>
            <div className="mb-4 p-2 bg-gray-50 rounded">
              <h4 className="font-medium">テーブルデータ：</h4>
              <p>表示データ件数: {data.length}件</p>
              <p>データキー: {data[0] ? Object.keys(data[0]).join(', ') : '不明'}</p>
            </div>
            <DataTable columns={columns} data={data} />
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            データがありません。ファイルをアップロードしてください。
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={downloadSampleCSV}>
            サンプルCSVをダウンロード
          </Button>
        </div>
      </div>
    </div>
  )
}

