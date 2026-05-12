import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/app-shell";
import { SearchInput, Tag } from "@/components/ui-kit";
import { sampleResults, areas, institutions } from "@/lib/data";
import { useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/buscar")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Resultados da busca — Scientia Discovery" },
      { name: "description", content: "Resultados da busca textual e semântica de produções científicas." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const [mode, setMode] = useState<"hybrid" | "fulltext" | "semantic">("hybrid");
  const [sort, setSort] = useState("relevance");

  return (
    <PageShell>
      <section className="border-b hairline bg-surface-elevated">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <Breadcrumbs items={[{ to: "/", label: "Início" }, { label: "Resultados" }]} />
          <div className="mt-5">
            <SearchInput defaultValue={q} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] text-muted-foreground">Modo</span>
              <div className="inline-flex overflow-hidden rounded-sm border">
                {(["hybrid", "fulltext", "semantic"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 text-[12.5px] ${
                      mode === m ? "bg-primary text-primary-foreground" : "bg-surface text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    {m === "hybrid" ? "Híbrido" : m === "fulltext" ? "Full-text" : "Semântico"}
                  </button>
                ))}
              </div>
              <span className="text-[12.5px] text-muted-foreground">
                {sampleResults.length} resultados — {q ? `para "${q}"` : "amostra"}
                <span className="ml-2 font-mono text-[11px] text-muted-foreground/80">142 ms</span>
              </span>
            </div>
            <label className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              Ordenar por
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-sm border bg-surface px-2 py-1 text-[12.5px] text-foreground"
              >
                <option value="relevance">Relevância</option>
                <option value="recent">Mais recentes</option>
                <option value="cited">Mais citados</option>
                <option value="qualis">Qualis</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[260px_1fr_280px]">
        {/* Filters */}
        <aside className="space-y-6">
          <FilterGroup title="Área de conhecimento" items={areas.slice(0, 5).map((a) => ({ label: a.name, count: a.count }))} />
          <FilterGroup title="Instituição" items={institutions.slice(0, 6).map((i) => ({ label: i, count: Math.floor(Math.random() * 800 + 120) }))} />
          <FilterGroup
            title="Qualis CAPES"
            items={[
              { label: "A1", count: 412 }, { label: "A2", count: 388 }, { label: "A3", count: 271 },
              { label: "A4", count: 220 }, { label: "B1", count: 167 },
            ]}
          />
          <YearRange />
          <FilterGroup
            title="Tipo de produção"
            items={[
              { label: "Artigo em periódico", count: 1820 },
              { label: "Trabalho em anais", count: 940 },
              { label: "Capítulo de livro", count: 312 },
              { label: "Tese / dissertação", count: 188 },
            ]}
          />
        </aside>

        {/* Results */}
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {q && <Chip label={`busca: ${q}`} />}
            <Chip label="Qualis: A1, A2" />
            <Chip label="2020 – 2024" />
            <Chip label="Área: Ciência da Computação" />
            <button className="text-[12px] text-muted-foreground underline-offset-4 hover:underline">
              limpar filtros
            </button>
          </div>

          <ul className="divide-y hairline border-y hairline">
            {sampleResults.map((r) => (
              <li key={r.id} className="py-6">
                <div className="flex items-center gap-2 text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span>{r.venue}</span>
                  <span>·</span>
                  <span>{r.year}</span>
                  <Tag tone="scholar">Qualis {r.qualis}</Tag>
                </div>
                <Link to="/" className="mt-1 block font-serif text-[20px] leading-snug tracking-tight text-foreground hover:underline">
                  {highlight(r.title, q)}
                </Link>
                <div className="mt-1.5 text-[13px] text-foreground/80">
                  {r.authors.map((a, i) => (
                    <span key={a}>
                      <Link to="/pesquisadores" className="underline-offset-4 hover:underline">{a}</Link>
                      {i < r.authors.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
                <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-muted-foreground">
                  {highlight(r.abstract, q)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {r.highlights.map((h) => <Tag key={h} tone="muted">{h}</Tag>)}
                  <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                    similaridade
                    <SimilarityBar value={r.similarity} />
                    <span className="text-foreground">{r.similarity.toFixed(2)}</span>
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-[12.5px] text-foreground/80">
                  <a className="underline-offset-4 hover:underline" href="#">DOI: {r.doi}</a>
                  <a className="underline-offset-4 hover:underline" href="#">Citar (BibTeX)</a>
                  <a className="underline-offset-4 hover:underline" href="#">Salvar na coleção</a>
                </div>
              </li>
            ))}
          </ul>

          <Pagination />
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <div className="rounded-md border bg-surface p-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Síntese da consulta
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">
              Os resultados concentram-se em estudos sobre recuperação semântica aplicada a
              currículos Lattes, com forte presença de grupos da UNEB, UFBA e USP. A produção
              cresce de forma consistente desde 2020.
            </p>
            <Link to="/assistente" className="mt-4 inline-flex items-center gap-2 text-[12.5px] text-foreground underline-offset-4 hover:underline">
              Aprofundar com o assistente →
            </Link>
          </div>

          <div className="rounded-md border bg-surface p-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Termos relacionados
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["recuperação semântica", "BM25", "currículos Lattes", "ranqueamento neural", "embeddings densos", "consulta híbrida"].map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>

          <div className="rounded-md border bg-surface p-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Coleções sugeridas
            </div>
            <ul className="mt-3 space-y-2 text-[13px]">
              {["Recuperação de informação acadêmica", "PLN para o português", "Cienciometria — Brasil"].map((c) => (
                <li key={c}><a href="#" className="text-foreground/85 underline-offset-4 hover:underline">{c}</a></li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function FilterGroup({ title, items }: { title: string; items: { label: string; count: number }[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b hairline pb-4">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
        <span className="font-mono text-[11px] text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="mt-3 space-y-1.5">
          {items.map((i) => (
            <li key={i.label}>
              <label className="flex items-center justify-between gap-2 text-[13px] text-foreground/85">
                <span className="flex items-center gap-2">
                  <input type="checkbox" className="h-3.5 w-3.5 accent-primary" />
                  {i.label}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">{i.count.toLocaleString("pt-BR")}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function YearRange() {
  return (
    <div className="border-b hairline pb-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Ano</div>
      <div className="mt-3 flex items-center gap-2 text-[12.5px]">
        <input defaultValue="2020" className="w-full rounded-sm border bg-surface px-2 py-1 font-mono" />
        <span className="text-muted-foreground">—</span>
        <input defaultValue="2024" className="w-full rounded-sm border bg-surface px-2 py-1 font-mono" />
      </div>
      <div className="relative mt-3 h-1 rounded-full bg-muted">
        <div className="absolute left-[20%] right-[5%] h-1 rounded-full bg-primary/80" />
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border bg-surface px-2 py-1 text-[12px] text-foreground/85">
      {label}
      <button className="text-muted-foreground hover:text-foreground" aria-label="remover">×</button>
    </span>
  );
}

function SimilarityBar({ value }: { value: number }) {
  return (
    <span className="inline-block h-1.5 w-16 overflow-hidden rounded-full bg-muted">
      <span className="block h-full bg-scholar/80" style={{ width: `${value * 100}%` }} />
    </span>
  );
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded-[2px] bg-scholar/15 px-0.5 text-foreground">{p}</mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function Pagination() {
  return (
    <nav className="mt-8 flex items-center justify-between">
      <div className="text-[12.5px] text-muted-foreground">Página 1 de 124</div>
      <div className="flex items-center gap-1">
        {["‹", "1", "2", "3", "4", "…", "124", "›"].map((p, i) => (
          <button
            key={i}
            className={`min-w-[32px] rounded-sm border px-2 py-1 text-[12.5px] ${
              p === "1" ? "bg-primary text-primary-foreground" : "bg-surface text-foreground/85 hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function Breadcrumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <ol className="flex items-center gap-2 text-[12px] text-muted-foreground">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-2">
          {it.to ? (
            <Link to={it.to} className="hover:text-foreground">{it.label}</Link>
          ) : (
            <span className="text-foreground/85">{it.label}</span>
          )}
          {i < items.length - 1 && <span>/</span>}
        </li>
      ))}
    </ol>
  );
}
