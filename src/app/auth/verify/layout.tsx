import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification Code",
  description: "Enter the verification code sent to your email",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
