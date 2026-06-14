import { checkAgentAuth } from "@/lib/auth-check"
import { DashboardHeader } from "@/app/[organization]/(agent)/_components/DashboardHeader"
import { BackgroundBlur } from "@/components/elements/BackgroundBlur"
import Footer from "../_components/Footer"
import { Props } from "../dashboard/page"
import { fetchTickets } from "./_lib/fetch_tickets"
import { TicketList, Ticket } from "./_components/TicketList"

export default async function TicketsPage({ params }: Props) {
  const user = await checkAgentAuth()
  const { organization } = await params;

  const rawTickets = await fetchTickets(organization);
  const ticketsData: Ticket[] = await JSON.parse(JSON.stringify(rawTickets));

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground transition-colors duration-300 selection:bg-primary/30">
      <BackgroundBlur />
      <DashboardHeader title="Tickets Queue" user={user} />

      <main className="px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
        <TicketList initialTickets={ticketsData as Ticket[]} />
      </main>

      <Footer />
    </div>
  )
}
