import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Preview,
  Section,
  Head,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  otp: string;
  isPasswordReset: boolean;
}

export default function VerificationEmail({ otp, isPasswordReset = false }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{isPasswordReset ? "Reset your password" : "Verify your email"}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{isPasswordReset ? "Reset your password" : "Verify your email"}</Heading>
          <Text style={paragraph}>{isPasswordReset ? "You requested a password reset. Please use the following code to set a new password:" : "Thank you for signing up, please use the following code to verify your email:"}</Text>
          <Section>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={paragraph}>If you did&apos;nt request this email, you can safely ignore it.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f0f0f0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  lineHeight: "1.5",
  fontWeight: "400",
  color: "#404040",
  margin: 0,
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "20px",
  width: "465px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
};

const paragraph = {
  fontSize: "16px",
  margin: "0 0 20px 0",
};

const code = {
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
  color: "#000000",
  backgroundColor: "#f0f0f0",
  padding: "10px",
  borderRadius: "5px",
  textAlign: "center" as const,
};