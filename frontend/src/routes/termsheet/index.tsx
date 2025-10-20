import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/termsheet/")({
  component: TermSheetPlayground,
});

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function TermSheetPlayground() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(5);
  const [amortization, setAmortization] = useState(12);
  const [term, setTerm] = useState(24);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSuggestions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/deals/d_429/term-sheet/suggestions?amount=${amount}&rate=${rate}&amortization=${amortization}&term=${term}`,
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      const json = await res.json();
      setSuggestions(json.suggestions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copySummary() {
    const summary = suggestions
      .map((s) => `${s.label || "Option"}: ${s.description || s.detail}`)
      .join("\n");
    navigator.clipboard.writeText(summary);
    alert("Copied summary to clipboard!");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Term-Sheet Playground</h1>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          Amount ($)
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col">
          Rate (%)
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col">
          Amortization (mo)
          <input
            type="number"
            value={amortization}
            onChange={(e) => setAmortization(Number(e.target.value))}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col">
          Term (mo)
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="border rounded p-2"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Suggestions"}
        </button>
        {suggestions.length > 0 && (
          <button
            onClick={copySummary}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Copy Summary
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-3 mt-4">
        {suggestions.length > 0 ? (
          suggestions.map((s, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50">
              <p className="font-semibold">
                {s.label || `Suggestion ${idx + 1}`}
              </p>
              <p className="text-sm text-gray-700">
                {s.description ||
                  s.detail ||
                  `Amount: $${amount}, Rate: ${rate}%, Amortization: ${amortization} mo, Term: ${term} mo`}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No suggestions returned.</p>
        )}
      </div>
    </div>
  );
}
