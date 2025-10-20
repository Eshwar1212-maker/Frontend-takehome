import { DealsTable } from "@/components/home/DealsTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-6">Deals Pipeline</h1>
      <DealsTable />
    </div>
  );
}
