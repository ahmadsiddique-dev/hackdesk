import * as React from "react"
import { UserTicketsContent } from "../_components/UserTicketsContent"

export default async function HelpCenterTicketsPage({
  params,
}: {
  params: Promise<{ organization: string }>
}) {
  const { organization } = await params

  const orgName = organization
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return <UserTicketsContent organizationName={orgName} />
}
