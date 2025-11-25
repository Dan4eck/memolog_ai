import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemeLog AI - AI Meme Generator",
  description: "Generate memes with AI - Pick a template, input a topic, get 4 AI-generated memes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
