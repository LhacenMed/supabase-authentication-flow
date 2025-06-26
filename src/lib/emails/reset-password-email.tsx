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

interface ResetPasswordEmailProps {
  userEmail: string;
  resetPasswordUrl: string;
}

export default function ResetPasswordEmail({userEmail, resetPasswordUrl="http://localhost:3000/auth/reset-password"}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Reset your password</Heading>
          <Text style={paragraph}>Thank you for requesting a password reset, {userEmail}!</Text>
          <Text style={paragraph}>Please click the button below to reset your password.</Text>
          <Section>
            <Link href={resetPasswordUrl} style={button}>Reset Password</Link>
          </Section>
          <Text style={paragraph}>Best regards,</Text>
          <Text style={paragraph}>The Rihleti Team</Text>
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

const button = {
  backgroundColor: "#000000",
  color: "#ffffff",
};