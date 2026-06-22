import { SubscribeForm } from "./SubscribeForm"

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-muted/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 md:items-start">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-foreground">Navigation</h3>
            <div className="flex flex-col gap-2.5 text-xs font-medium text-muted-foreground">
              <a
                href="#features"
                className="transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#demo"
                className="transition-colors hover:text-foreground"
              >
                Interactive Demo
              </a>
              <a
                href="#testimonials"
                className="transition-colors hover:text-foreground"
              >
                Testimonials
              </a>
              <a
                href="#docs"
                className="transition-colors hover:text-foreground"
              >
                Docs
              </a>
            </div>
          </div>

          <SubscribeForm />
        </div>

        <div className="text-2xs flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-muted-foreground sm:flex-row">
          <div>
            <span className="font-bold text-foreground">HackDesk</span>{" "}
            &copy; {new Date().getFullYear()} All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>made with &lt;3 by</span>
            <span className="font-semibold text-foreground underline decoration-red-500/50 underline-offset-4">
              Ahmd Siddique
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
