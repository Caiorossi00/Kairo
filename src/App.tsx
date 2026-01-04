import { YearGrid } from "./ui/YearGrid";
import { year2026 } from "./mocks/year";

export default function App() {
  return (
    <div style={{ padding: 24, background: "#0f0f0f", minHeight: "100vh" }}>
      <h2 style={{ color: "#fff" }}>Kairo</h2>
      <YearGrid days={year2026} />
    </div>
  );
}
