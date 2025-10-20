import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/deals/")({
  component: DealViewer,
})

const API_URL = import.meta.env.VITE_API_URL
const API_TOKEN = import.meta.env.VITE_API_TOKEN

function DealViewer() {
  const [search, setSearch] = useState("")
  const [deal, setDeal] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function fetchDealByName() {
    if (!search.trim()) return
    setLoading(true)
    setError("")
    setDeal(null)

    try {
      // Step 1: Fetch all deals and filter by borrower name
      const res = await fetch(`${API_URL}/deals`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      })
      if (!res.ok) throw new Error("Failed to fetch deals")
      const data = await res.json()

      const match = data.items.find((d: any) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      )

      if (!match) throw new Error("No matching borrower found")

      // Step 2: Fetch that specific deal’s details
      const detailRes = await fetch(`${API_URL}/deals/${match.id}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      })
      if (!detailRes.ok) throw new Error("Failed to fetch deal details")
      const detailData = await detailRes.json()

      setDeal(detailData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Deal Detail Viewer</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter borrower name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={fetchDealByName}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Deal
        </button>
      </div>

      {loading && <p>Loading deal details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {deal && (
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Overview</h2>
            <p><strong>Name:</strong> {deal.name}</p>
            <p><strong>Product:</strong> {deal.product}</p>
            <p><strong>Stage:</strong> {deal.stage}</p>
            <p><strong>Amount:</strong> ${deal.requestedAmount}</p>
            <p><strong>Risk Score:</strong> {(deal.riskScore * 100).toFixed(0)}%</p>
            <p><strong>Updated:</strong> {new Date(deal.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Checklist</h2>
            <p>Would fetch from <code>/deals/{deal.id}/checklist</code></p>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Activity</h2>
            <p>Would fetch from <code>/deals/{deal.id}/activity</code></p>
          </div>
        </div>
      )}
    </div>
  )
}
