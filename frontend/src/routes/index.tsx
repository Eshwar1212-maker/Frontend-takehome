import { DealsTable } from "@/components/home/DealsTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-6">Deals Pipeline</h1>

      <div className="mb-6">
        <button
          onClick={() => navigate({ to: "/termsheet" })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Term Sheet
        </button>
      </div>
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: "/deals" })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Find specific deals
        </button>
      </div>
      <DealsTable />
    </div>
  );
}
