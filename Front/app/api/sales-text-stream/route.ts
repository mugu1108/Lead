import type { NextRequest } from "next/server"

// サンプルの営業文面
const sampleSalesTexts = [
  "貴社の業務効率化に弊社のソリューションが最適です。デモのご案内をさせていただければ幸いです。",
  "御社の課題解決に向けて、弊社の専門チームがサポートいたします。ぜひ一度ご相談ください。",
  "新サービス導入で30%のコスト削減に成功した事例があります。詳細資料をお送りしますので、ご検討いただければ幸いです。",
  "業界トップクラスの実績を持つ弊社のコンサルタントが、貴社の課題に合わせた最適な提案をいたします。",
  "他社との差別化を図るための戦略的パートナーとして、弊社のサービスをご検討ください。",
]

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // サンプルデータのIDを生成
      const ids = Array.from({ length: 20 }, (_, i) => `${i + 1}`)

      // 各IDに対して営業文面を生成して送信
      for (const id of ids) {
        // ランダムな遅延を追加（リアルタイム更新のシミュレーション）
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

        const salesText = sampleSalesTexts[Math.floor(Math.random() * sampleSalesTexts.length)]

        const data = {
          id,
          text: salesText,
        }

        // SSE形式でデータを送信
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // 全データ送信後にストリームを閉じる
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

