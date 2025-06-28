import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Create a new password for your account",
};

export default function NewPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
