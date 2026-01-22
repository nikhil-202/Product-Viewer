import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Product Customizer | Interactive Shoe Viewer",
  description: "Interactive 3D product customizer featuring a shoe model with real-time color and material customization using Three.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
