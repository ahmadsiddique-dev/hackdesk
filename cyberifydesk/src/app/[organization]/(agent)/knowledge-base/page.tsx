import { checkAgentAuth } from "@/lib/auth-check"
import { DashboardHeader } from "@/app/[organization]/(agent)/_components/DashboardHeader"
import { BackgroundBlur } from "@/components/elements/BackgroundBlur"
import Footer from "../_components/Footer"
import { KbUpload } from "./_components/KbUpload"
import { IconInfoCircle } from "@tabler/icons-react"

export type Props = {
  params: Promise<{ organization: string }>
}

export default async function KnowledgeBasePage({ params }: Props) {
  const user = await checkAgentAuth()
  const { organization } = await params

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground transition-colors duration-300 selection:bg-primary/30">
      <BackgroundBlur />
      <DashboardHeader title="Knowledge Base" user={user} />

      <main className="px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center gap-8">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-2 text-xs font-medium text-orange-400 backdrop-blur-sm">
            <IconInfoCircle className="size-4 shrink-0" />
            <span>Security flaw! Your docs data can be accessed by other organization AI assistant, Will be fixed soon</span>
          </div>
        </div>
        <KbUpload />
      </main>

      <Footer />
    </div>
  )
}
