import * as React from "react"
import { UserContent } from "../_components/UserContent"

export default async function HelpCenterPage({
  params,
}: {
  params: Promise<{ organization: string }>
}) {
  const { organization } = await params

  const orgName = organization
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return (
    <div className="mx-auto w-full max-w-4xl">
      <UserContent organizationName={orgName} />
    </div>
  )
}
