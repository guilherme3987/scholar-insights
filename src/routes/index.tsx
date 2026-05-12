import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/app-shell";
import { SearchInput } from "@/components/ui-kit";
import { StatCard, SectionHeader, Tag } from "@/components/ui-kit";
import { AreaShareBars, ProductionBars } from "@/components/charts";
import { researchers, areas } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scientia Discovery — Busca científica e mapeamento de competências" },
      { name: "description", content: "Plataforma acadêmica de busca semântica e mapeamento de competências científicas a partir da Plataforma Lattes." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative border-b hairline">
        <div className="absolute inset-0 bg-grid opacity-[0.35]" aria-hidden />
        <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-20">
          <div className="flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-px w-8 bg-foreground/40" />
            Plataforma de descoberta científica
          </div>
          <h1 className="mt-5 max-w-3xl font-serif text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[56px]">
            Encontre pesquisadores, produções e competências científicas em toda a base Lattes.
          </h1>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground">
            Scientia Discovery integra busca textual, recuperação semântica e indicadores
            cienciométricos para mapear o conhecimento produzido em universidades brasileiras —
            com a precisão exigida por programas de pós-graduação, gestores e pesquisadores.
          </p>

          <div className="mt-9 max-w-3xl">
            <SearchInput />
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
              <span className="font-medium text-foreground/70">Sugestões</span>
              {[
                "ontologias em ciência da informação",
                "redes de colaboração no Nordeste",
                "PLN para o português brasileiro",
              ].map((s) => (
                <Link
                  key={s}
                  to="/buscar"
                  search={{ q: s } as never}
                  className="underline-offset-4 hover:underline"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Currículos indexados" value="41 287" sub="Plataforma Lattes — atualização semanal" />
            <StatCard label="Produções científicas" value="312 940" sub="Artigos, capítulos, anais e teses" />
            <StatCard label="Instituições" value="184" sub="Universidades públicas e privadas" />
            <StatCard label="Áreas CNPq" value="76" sub="Cobertura por grande área e subárea" />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <SectionHeader
          eyebrow="Capacidades"
          title="Três modalidades de busca, uma única interface."
          description="Combine recuperação textual, semântica e exploratória para responder perguntas que vão desde citações específicas até a descoberta de competências emergentes em uma instituição."
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-md border bg-border md:grid-cols-3">
          {[
            {
              t: "Full-text",
              d: "Indexação textual rigorosa sobre títulos, resumos e palavras-chave, com operadores booleanos, filtros por Qualis, DOI e ano, e ranqueamento BM25.",
              note: "PostgreSQL · Elastic",
            },
            {
              t: "Semântica",
              d: "Embeddings vetoriais geram similaridade conceitual entre consultas em linguagem natural e a produção científica, mesmo sem termos exatos.",
              note: "pgvector · LangChain",
            },
            {
              t: "Exploratória",
              d: "Navegação assistida por sugestões contextuais, expansão de consulta e mapas temáticos para descobrir conexões entre áreas e pesquisadores.",
              note: "Knowledge graph",
            },
          ].map((c) => (
            <div key={c.t} className="bg-surface p-7">
              <div className="font-serif text-[20px] tracking-tight text-foreground">{c.t}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{c.d}</p>
              <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {c.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured researchers + areas */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeader
              eyebrow="Pesquisadores em destaque"
              title="Curadoria editorial da semana"
              action={
                <Link to="/pesquisadores" className="text-[13px] text-foreground underline-offset-4 hover:underline">
                  Ver todos →
                </Link>
              }
            />
            <ul className="mt-8 divide-y hairline rounded-md border bg-surface">
              {researchers.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link
                    to="/pesquisadores/$id"
                    params={{ id: r.id }}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-4 hover:bg-muted/40"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/8 font-serif text-[15px] text-primary">
                      {r.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif text-[16px] text-foreground">{r.name}</div>
                      <div className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                        {r.area} · {r.institution}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.subareas.slice(0, 3).map((s) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">h-index</div>
                      <div className="font-serif text-[22px] leading-none text-foreground">{r.hIndex}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader eyebrow="Distribuição" title="Produção por área de conhecimento" />
            <div className="mt-8 rounded-md border bg-surface p-5">
              <AreaShareBars />
              <div className="mt-5 border-t hairline pt-4 text-[12px] text-muted-foreground">
                Recorte de {areas.reduce((a, b) => a + b.count, 0).toLocaleString("pt-BR")} produções
                indexadas no último triênio CAPES.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production timeline */}
      <section className="border-t hairline bg-surface-elevated">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <SectionHeader
            eyebrow="Indicadores"
            title="Evolução agregada da produção científica"
            description="Série histórica anual considerando os pesquisadores indexados na plataforma, agregada por ano de publicação."
          />
          <div className="mt-8 rounded-md border bg-surface p-6">
            <ProductionBars
              data={[
                { year: 2017, count: 18 }, { year: 2018, count: 23 }, { year: 2019, count: 31 },
                { year: 2020, count: 36 }, { year: 2021, count: 44 }, { year: 2022, count: 52 },
                { year: 2023, count: 61 }, { year: 2024, count: 70 },
              ]}
              height={140}
            />
            <div className="mt-5 grid grid-cols-2 gap-4 border-t hairline pt-5 text-[12.5px] text-muted-foreground md:grid-cols-4">
              <div><span className="font-mono text-foreground">+24%</span> crescimento médio anual</div>
              <div><span className="font-mono text-foreground">A1/A2</span> 38% do total Qualis</div>
              <div><span className="font-mono text-foreground">187</span> colaborações internacionais</div>
              <div><span className="font-mono text-foreground">12</span> grandes áreas com expansão</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="overflow-hidden rounded-md border bg-surface">
          <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
            <div className="p-10">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Para instituições
              </div>
              <h3 className="mt-3 font-serif text-[28px] leading-tight tracking-tight text-foreground">
                Mapeamento institucional de competências científicas.
              </h3>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
                Conecte sua pró-reitoria de pós-graduação à plataforma e obtenha relatórios
                customizados de produção, redes de colaboração e potencial de submissão a editais.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/dashboard"
                  className="rounded-sm bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Explorar Analytics
                </Link>
                <Link
                  to="/api-docs"
                  className="rounded-sm border px-4 py-2 text-[13px] text-foreground hover:bg-muted"
                >
                  Documentação da API
                </Link>
              </div>
            </div>
            <div className="border-t hairline bg-surface-elevated p-10 md:border-l md:border-t-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Integrações
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                {["Plataforma Lattes", "ORCID", "DSpace / repositórios", "Apache Hop (ETL)", "PostgreSQL + pgvector", "Power BI", "FastAPI", "LangChain"].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground/85">
                    <span className="h-1 w-1 rounded-full bg-foreground/60" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
