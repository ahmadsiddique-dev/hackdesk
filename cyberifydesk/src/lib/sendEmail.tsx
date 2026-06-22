import { Resend } from "resend"
import * as React from "react"
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components"

const resend = new Resend(process.env.RESEND_API_KEY)

interface OtpEmailProps {
  name: string
  otp: string
}

const OtpEmail = ({ name, otp }: OtpEmailProps) => (
  <Html lang="en">
    <Head />
    <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9", padding: "20px" }}>
      <Preview>Verify your HackDesk Account</Preview>
      <Container style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "8px", maxWidth: "500px", margin: "0 auto" }}>
        <Heading style={{ fontSize: "24px", color: "#333", marginBottom: "16px" }}>Verification Code</Heading>
        <Text style={{ fontSize: "16px", color: "#555", lineHeight: "1.5" }}>Hi {name},</Text>
        <Text style={{ fontSize: "16px", color: "#555", lineHeight: "1.5" }}>
          Thank you for registering at HackDesk. Please use the following One-Time Password (OTP) to complete your signup process. This code is valid for 10 minutes:
        </Text>
        <Section style={{ textAlign: "center", margin: "24px 0" }}>
          <span style={{ fontSize: "32px", fontWeight: "bold", color: "#ec3750", letterSpacing: "4px", backgroundColor: "#f3f4f6", padding: "12px 24px", borderRadius: "6px", display: "inline-block" }}>
            {otp}
          </span>
        </Section>
        <Text style={{ fontSize: "14px", color: "#888", marginTop: "32px" }}>
          If you did not request this code, you can safely ignore this email. Note: If you don't see this email in your inbox, please check your spam or junk folder.
        </Text>
      </Container>
    </Body>
  </Html>
)

export async function sendOtpEmail(email: string, name: string, otp: string) {
  const { data, error } = await resend.emails.send({
    from: "HackDesk <me@ahmadsiddique.dev>",
    to: [email],
    subject: "Verify your HackDesk Account",
    react: <OtpEmail name={name} otp={otp} />,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
