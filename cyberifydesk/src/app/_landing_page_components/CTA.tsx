import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="relative mx-auto flex max-w-5xl flex-col items-center overflow-hidden rounded-3xl border border-border/40 bg-card/30 px-8 py-16 text-center shadow-2xl">
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/10 blur-[100px]" />

        <h2 className="relative mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to scale your support operations?
        </h2>
        <p className="relative mb-10 max-w-xl text-sm text-muted-foreground sm:text-base">
          Join teams deflection-tuning their ticket lifecycles today. Set up
          your AI desk in under five minutes.
        </p>

        <Button
          asChild
          size="lg"
          className="relative rounded-full bg-linear-to-r from-orange-600 to-amber-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-orange-500 hover:to-amber-400"
        >
          <Link href="/signup">Get Started For Free</Link>
        </Button>
      </div>
    </section>
  )
}
