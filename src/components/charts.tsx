import { researchers, areas } from "@/lib/data";

export function ProductionBars({ data, height = 80 }: { data: { year: number; count: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d) => (
        <div key={d.year} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-[2px] bg-primary/85"
            style={{ height: `${(d.count / max) * (height - 18)}px` }}
            title={`${d.year}: ${d.count}`}
          />
          <span className="font-mono text-[9.5px] text-muted-foreground">'{String(d.year).slice(2)}</span>
        </div>
      ))}
    </div>
  );
}

export function AreaShareBars() {
  const max = Math.max(...areas.map((a) => a.count));
  return (
    <div className="space-y-3">
      {areas.map((a) => (
        <div key={a.name} className="grid grid-cols-[180px_1fr_60px] items-center gap-3 text-[12.5px]">
          <div className="truncate text-foreground/85">{a.name}</div>
          <div className="h-2 overflow-hidden rounded-sm bg-muted">
            <div
              className="h-full rounded-sm bg-primary/80"
              style={{ width: `${(a.count / max) * 100}%` }}
            />
          </div>
          <div className="text-right font-mono text-[11.5px] text-muted-foreground">
            {a.count.toLocaleString("pt-BR")}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CollaborationGraph() {
  // Simple mid-fi network visualization with absolute positioning
  const nodes = [
    { id: "ana", label: "A. Cardoso", x: 50, y: 50, r: 18, primary: true },
    { id: "marcelo", label: "M. Tavares", x: 18, y: 28, r: 12 },
    { id: "rafaela", label: "R. Nunes", x: 78, y: 22, r: 10 },
    { id: "eduardo", label: "E. Pires", x: 82, y: 70, r: 11 },
    { id: "sofia", label: "S. Beltrão", x: 22, y: 78, r: 10 },
    { id: "joana", label: "J. Ribeiro", x: 50, y: 88, r: 8 },
  ];
  const links = [
    ["ana", "marcelo"], ["ana", "rafaela"], ["ana", "eduardo"], ["ana", "sofia"],
    ["marcelo", "joana"], ["sofia", "eduardo"],
  ];
  const find = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-md border bg-surface bg-grid">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {links.map(([a, b], i) => {
          const A = find(a), B = find(b);
          return (
            <line
              key={i}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="currentColor"
              strokeWidth="0.18"
              className="text-foreground/30"
            />
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div
            className={`flex items-center justify-center rounded-full ${n.primary ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-foreground border"}`}
            style={{ width: n.r * 2, height: n.r * 2 }}
          >
            <span className="font-serif text-[10px]">{n.label.split(" ")[0][0]}{n.label.split(" ")[1]?.[0]}</span>
          </div>
          <div className="mt-1 whitespace-nowrap text-center font-mono text-[10px] text-muted-foreground">
            {n.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AreaHeatmap() {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const rows = researchers.slice(0, 6);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground"></th>
            {years.map((y) => (
              <th key={y} className="px-2 text-center font-mono text-[10.5px] text-muted-foreground">{y}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="pr-3 text-[12px] text-foreground/85 whitespace-nowrap">{r.name}</td>
              {years.map((y) => {
                const found = r.production.find((p) => p.year === y);
                const v = found?.count ?? 0;
                const opacity = Math.min(1, v / 18 + 0.08);
                return (
                  <td key={y} className="p-0">
                    <div
                      className="h-7 w-full rounded-[2px]"
                      style={{ backgroundColor: `oklch(0.27 0.045 255 / ${opacity})` }}
                      title={`${r.name} • ${y}: ${v} produções`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
