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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
          {orgName} Help Center
        </h1>
        <p className="max-w-lg text-sm text-muted-foreground">
          Welcome to our support portal. Submit a ticket for agent assistance,
          track active inquiries, or interact with our AI assistant.
        </p>
      </div>
      <UserContent organizationName={orgName} />
    </main>
  );
}
