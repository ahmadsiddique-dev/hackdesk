import {
  IconBrain,
  IconMessage2,
  IconDatabase,
  IconGitCommit,
} from "@tabler/icons-react"

export function Features() {
  return (
    <section id="features" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
          Hacker Superpowers
        </h2>
        <p className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Everything you need to manage hacker queries.
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          An open-source ticket system built specifically to help you handle dev questions,
          triage issues, and guide builders through bugs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 transition-all hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 transition-transform group-hover:scale-110 dark:text-red-400">
            <IconBrain />
          </div>
          <h3 className="mb-2 text-lg font-bold">AI Issue Assistant</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Automatically summarizes code context, highlights dependencies, and flags blocker
            priority as soon as an issue is created.
          </p>
        </div>

        <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 transition-all hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 transition-transform group-hover:scale-110 dark:text-red-400">
            <IconMessage2 />
          </div>
          <h3 className="mb-2 text-lg font-bold">One-Click Hacker Replies</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Drafts code-aware and friendly responses to support tickets instantly, saving
            maintainers from repetitive formatting.
          </p>
        </div>

        <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 transition-all hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 transition-transform group-hover:scale-110 dark:text-red-400">
            <IconDatabase />
          </div>
          <h3 className="mb-2 text-lg font-bold">Instant Docs RAG</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Auto-solves technical questions by retrieving answers directly from your project's
            wiki, docs, and readme files.
          </p>
        </div>

        <div className="group relative rounded-2xl border border-border/40 bg-card/30 p-6 transition-all hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 transition-transform group-hover:scale-110 dark:text-red-400">
            <IconGitCommit />
          </div>
          <h3 className="mb-2 text-lg font-bold">
            Collaborative Timelines
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Open timeline tracking from issue creation, team assignment, to pull-request
            resolutions and closing commits.
          </p>
        </div>
      </div>
    </section>
  )
}
