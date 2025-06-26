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

interface WelcomeProps {
  userEmail: string;
  dashboardUrl?: string;
}

export default function WelcomeEmail({
  userEmail,
  dashboardUrl = "http://localhost:3000/dashboard",
}: WelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to Rihleti!</Heading>
          <Text style={paragraph}>
            Thank you for signing us, {userEmail}!. We&apos;re excited to have
            you on board.
          </Text>
          <Text style={paragraph}>
            You now can access all features of our platform. If you have any
            questions, feel free to contact our team.
          </Text>
          <Section>
            <Link href={dashboardUrl} style={button}>
              Go to Dashboard
            </Link>
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
