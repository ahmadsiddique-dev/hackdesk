import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/elements/ThemeSwitch"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <img
            src="https://assets.hackclub.com/flag-standalone.svg"
            alt="HackDesk Logo"
            className="h-8 object-contain"
          />
          <span className="bg-linear-to-r from-red-500 to-rose-600 bg-clip-text text-xl font-black tracking-tight text-transparent">
            HackDesk
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a href="#demo" className="transition-colors hover:text-foreground">
            Interactive Demo
          </a>
          <a
            href="#testimonials"
            className="transition-colors hover:text-foreground"
          >
            Testimonials
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <Button
            variant="ghost"
            asChild
            className="hidden rounded-full text-sm font-semibold sm:inline-flex"
          >
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-linear-to-r from-red-500 to-rose-600 px-5 font-semibold text-white shadow-md shadow-red-500/10 hover:from-red-600 hover:to-rose-700"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
