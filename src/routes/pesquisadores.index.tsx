import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/app-shell";
import { SearchInput, Tag, SectionHeader } from "@/components/ui-kit";
import { researchers, areas, institutions } from "@/lib/data";
import { ProductionBars } from "@/components/charts";

export const Route = createFileRoute("/pesquisadores/")({
  head: () => ({
    meta: [
      { title: "Pesquisadores — Scientia Discovery" },
      { name: "description", content: "Explore pesquisadores indexados a partir da Plataforma Lattes." },
    ],
  }),
  component: ResearchersPage,
});

function ResearchersPage() {
  return (
    <PageShell>
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <SectionHeader
            eyebrow="Diretório"
            title="Pesquisadores"
            description="Explore pesquisadores por área, instituição e linha de pesquisa. Os perfis combinam dados curriculares oficiais e indicadores derivados da produção indexada."
          />
          <div className="mt-6 max-w-2xl">
            <SearchInput size="md" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 text-[13px]">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Área</div>
            <ul className="mt-3 space-y-1.5">
              {areas.map((a) => (
                <li key={a.name} className="flex items-center justify-between text-foreground/85">
                  <a href="#" className="hover:text-foreground">{a.name}</a>
                  <span className="font-mono text-[11px] text-muted-foreground">{a.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Instituição</div>
            <ul className="mt-3 space-y-1.5">
              {institutions.map((i) => (
                <li key={i} className="text-foreground/85">
                  <a href="#" className="hover:text-foreground">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between text-[12.5px] text-muted-foreground">
            <span>{researchers.length} pesquisadores · curadoria editorial</span>
            <div className="flex items-center gap-2">
              <span>Visualização</span>
              <div className="inline-flex overflow-hidden rounded-sm border">
                <button className="bg-primary px-2 py-1 text-primary-foreground">Lista</button>
                <button className="bg-surface px-2 py-1 hover:bg-muted">Cards</button>
              </div>
            </div>
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {researchers.map((r) => (
              <li key={r.id} className="rounded-md border bg-surface p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 font-serif text-[15px] text-primary">
                    {r.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/pesquisadores/$id"
                      params={{ id: r.id }}
                      className="font-serif text-[17px] tracking-tight text-foreground hover:underline"
                    >
                      {r.name}
                    </Link>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">{r.title}</div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">{r.institution}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {r.subareas.map((s) => <Tag key={s}>{s}</Tag>)}
                </div>
                <div className="mt-5">
                  <ProductionBars data={r.production} height={56} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t hairline pt-3 text-[12px]">
                  <Stat label="h-index" value={String(r.hIndex)} />
                  <Stat label="Produções" value={String(r.publications)} />
                  <Stat label="Citações" value={r.citations.toLocaleString("pt-BR")} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="font-serif text-[17px] text-foreground">{value}</div>
    </div>
  );
}
