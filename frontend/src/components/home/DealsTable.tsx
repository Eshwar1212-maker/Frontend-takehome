"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

const API_URL = import.meta.env.VITE_API_URL
const API_TOKEN = import.meta.env.VITE_API_TOKEN

export type Deal = {
  id: string
  name: string
  product: string
  stage: string
  requestedAmount: number
  riskScore: number
  docsProgress: number
  updatedAt: string
}

async function fetchDeals(): Promise<Deal[]> {
  const res = await fetch(`${API_URL}/deals`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  })
  if (!res.ok) throw new Error("Failed to fetch deals")
  const json = await res.json()
  return json.items
}

export function DealsTable() {
  const [search, setSearch] = useState("")
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["deals"],
    queryFn: fetchDeals,
  })

  const navigate = useNavigate()

  const filteredDeals =
    data?.filter((deal) =>
      deal.name.toLowerCase().includes(search.toLowerCase())
    ) ?? []

  if (isLoading) return <div className="p-4">Loading deals...</div>
  if (isError) return <div className="p-4 text-red-500">Failed to load deals</div>

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search borrower..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md p-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={() => {
            refetch()
            alert("Refetched successfully")
          }}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full border-collapse text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="text-left p-3 border-b">Borrower</th>
          <th className="text-left p-3 border-b">Product</th>
          <th className="text-left p-3 border-b">Stage</th>
          <th className="text-right p-3 border-b">Amount</th>
          <th className="text-right p-3 border-b">Docs %</th>
          <th className="text-right p-3 border-b">Risk</th>
          <th className="text-right p-3 border-b">Updated</th>
        </tr>
      </thead>
      <tbody>
        {filteredDeals.length ? (
          filteredDeals.map((deal) => (
            <tr
              key={deal.id}
              onClick={() => navigate({ to: `/deals/${deal.id}` })}
              className="hover:bg-gray-50 cursor-pointer transition"
            >
              <td className="p-3 border-b font-medium text-blue-600 hover:underline">
                {deal.name}
              </td>
              <td className="p-3 border-b">{deal.product}</td>
              <td className="p-3 border-b">{deal.stage}</td>
              <td className="p-3 border-b text-right">
                {deal.requestedAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td className="p-3 border-b text-right">
                {(deal.docsProgress * 100).toFixed(0)}%
              </td>
              <td className="p-3 border-b text-right">
                {(deal.riskScore * 100).toFixed(0)}
              </td>
              <td className="p-3 border-b text-right">
                {new Date(deal.updatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="p-6 text-center text-gray-500">
              No results found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
      </div>
    </div>
  )
}
