import { IconStar } from "@tabler/icons-react"

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Lead Organizer, HackOut Hackathon",
    quote:
      "Before HackDesk, our hackathon mentors were drowning in duplicate wifi and setup queries. Integrating our dev wikis took 3 minutes, and now the AI solves 42% of hacker questions automatically!",
    metric: "42% Deflected",
    initials: "SJ",
    gradient: "from-red-500 to-rose-500",
  },
  {
    name: "David Chen",
    role: "Creator, DevFlow UI library",
    quote:
      "The One-Click Hacker Replies are a game-changer. It gets the context of the issue instantly and drafts responses with 95%+ accuracy. Triage time dropped from hours to seconds.",
    metric: "Instant Triage",
    initials: "DC",
    gradient: "from-rose-500 to-red-600",
  },
  {
    name: "Elena Rostova",
    role: "Maintainer, CloudScale CLI",
    quote:
      "We sync our dev manuals to the vector database, and the RAG engine answers complex configuration questions with zero hallucination. Our community gets answers immediately.",
    metric: "Accurate Answers",
    initials: "ER",
    gradient: "from-red-500 to-rose-600",
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-border/40 py-20 md:py-28"
    >
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
          Testimonials
        </h2>
        <p className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Loved by open-source maintainers.
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          See how developers are managing ticket triage, automating setup replies,
          and keeping their communities happy.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="group relative flex flex-col justify-between rounded-3xl border border-border/40 bg-card/30 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5"
          >
            <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-red-600 uppercase backdrop-blur-sm dark:text-red-400">
              {t.metric}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar
                     key={i}
                     className="size-4 fill-red-500 text-red-500"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4 border-t border-border/40 pt-6">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${t.gradient} text-xs font-bold text-white`}
              >
                {t.initials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                <span className="text-2xs text-muted-foreground">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
