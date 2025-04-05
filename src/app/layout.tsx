import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mono-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Interview Platform",
  description: "AI powered Interview Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.variable} pattern  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
