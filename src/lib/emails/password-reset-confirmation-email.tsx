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

interface PasswordResetConfirmationEmailProps {
  userEmail: string;
  loginUrl: string;
}

export default function PasswordResetConfirmationEmail({userEmail, loginUrl="http://localhost:3000/auth/login"}: PasswordResetConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your password has been reset successfully</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your password has been reset successfully</Heading>
          <Text style={paragraph}>Thank you for resetting your password, {userEmail}!</Text>
          <Text style={paragraph}>Please use it to login to your account.</Text>
          <Section>
            <Link href={loginUrl} style={button}>Login</Link>
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