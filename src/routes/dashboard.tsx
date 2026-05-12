import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/app-shell";
import { SectionHeader, StatCard, Tag } from "@/components/ui-kit";
import { AreaShareBars, AreaHeatmap, ProductionBars } from "@/components/charts";
import { researchers } from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Analytics — Scientia Discovery" },
      { name: "description", content: "Indicadores cienciométricos e analytics da produção indexada." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const ranking = [...researchers].sort((a, b) => b.citations - a.citations);
  return (
    <PageShell>
      <section className="border-b hairline bg-surface-elevated">
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Painel institucional"
              title="Analytics da produção científica"
              description="Indicadores agregados sobre o conjunto de pesquisadores e produções indexadas, com filtros por instituição, programa e área CNPq."
            />
            <div className="flex flex-wrap gap-2">
              <select className="rounded-sm border bg-surface px-3 py-1.5 text-[12.5px]">
                <option>Triênio CAPES — 2022–2024</option>
                <option>Quadriênio — 2021–2024</option>
              </select>
              <select className="rounded-sm border bg-surface px-3 py-1.5 text-[12.5px]">
                <option>Todas as instituições</option>
                <option>UNEB</option>
                <option>UFBA</option>
              </select>
              <button className="rounded-sm bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground">Exportar</button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] space-y-10 px-6 py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Produções no período" value="312 940" trend="+12.4%" />
          <StatCard label="Pesquisadores ativos" value="9 812" trend="+3.1%" />
          <StatCard label="Qualis A1 / A2" value="38%" trend="+4.7 pp" />
          <StatCard label="Colaborações internacionais" value="2 187" trend="+18.0%" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-md border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Série histórica</div>
                <h3 className="mt-1 font-serif text-[20px] tracking-tight">Produção anual agregada</h3>
              </div>
              <div className="flex gap-2 text-[12px] text-muted-foreground">
                <Tag>Artigos</Tag><Tag tone="muted">Anais</Tag><Tag tone="muted">Capítulos</Tag>
              </div>
            </div>
            <div className="mt-6">
              <ProductionBars
                data={[
                  { year: 2017, count: 18 }, { year: 2018, count: 23 }, { year: 2019, count: 31 },
                  { year: 2020, count: 36 }, { year: 2021, count: 44 }, { year: 2022, count: 52 },
                  { year: 2023, count: 61 }, { year: 2024, count: 70 },
                ]}
                height={170}
              />
            </div>
          </div>

          <div className="rounded-md border bg-surface p-6">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Distribuição</div>
            <h3 className="mt-1 font-serif text-[20px] tracking-tight">Produção por área</h3>
            <div className="mt-6">
              <AreaShareBars />
            </div>
          </div>
        </div>

        <div className="rounded-md border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Heatmap</div>
              <h3 className="mt-1 font-serif text-[20px] tracking-tight">Produção por pesquisador e ano</h3>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">intensidade = nº de produções</span>
          </div>
          <div className="mt-6">
            <AreaHeatmap />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border bg-surface">
            <div className="border-b hairline px-6 py-4">
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Ranking</div>
              <h3 className="mt-1 font-serif text-[18px] tracking-tight">Pesquisadores por citações</h3>
            </div>
            <ol className="divide-y hairline">
              {ranking.map((r, i) => (
                <li key={r.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-4 px-6 py-3 text-[13.5px]">
                  <span className="font-mono text-[12px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="text-foreground">{r.name}</div>
                    <div className="text-[11.5px] text-muted-foreground">{r.institution}</div>
                  </div>
                  <span className="font-mono text-[13px] text-foreground">{r.citations.toLocaleString("pt-BR")}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-md border bg-surface">
            <div className="border-b hairline px-6 py-4">
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Qualidade editorial</div>
              <h3 className="mt-1 font-serif text-[18px] tracking-tight">Distribuição Qualis CAPES</h3>
            </div>
            <div className="space-y-3 p-6">
              {[
                { l: "A1", v: 22 }, { l: "A2", v: 16 }, { l: "A3", v: 14 },
                { l: "A4", v: 12 }, { l: "B1", v: 10 }, { l: "B2", v: 9 }, { l: "Outros", v: 17 },
              ].map((q) => (
                <div key={q.l} className="grid grid-cols-[40px_1fr_40px] items-center gap-3 text-[12.5px]">
                  <span className="font-mono text-[12px] text-foreground">{q.l}</span>
                  <div className="h-2 overflow-hidden rounded-sm bg-muted">
                    <div className="h-full rounded-sm bg-scholar/80" style={{ width: `${q.v * 4}%` }} />
                  </div>
                  <span className="text-right font-mono text-[11.5px] text-muted-foreground">{q.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
