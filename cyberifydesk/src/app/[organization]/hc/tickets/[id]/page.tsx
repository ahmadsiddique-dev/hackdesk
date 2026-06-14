import * as React from "react"
import { TicketChatContent } from "../../_components/TicketChatContent"

export default async function HelpCenterTicketChatPage({
  params,
}: {
  params: Promise<{ organization: string; id: string }>
}) {
  const { organization, id } = await params

  const orgName = organization
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return <TicketChatContent organizationName={orgName} ticketId={id} />
}
