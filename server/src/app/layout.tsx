import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IARVS Admin Sidebar",
  description:
    "Responsive administration dashboard for the IARVS University Portal.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}