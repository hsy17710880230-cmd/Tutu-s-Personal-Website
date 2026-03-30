import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka, Schoolbell } from "next/font/google";

import "./globals.css";
import LandscapeGuard from "../components/LandScapeGuard";
// import { AuthProvider } from "../components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const schoolbell = Schoolbell({
  variable: "--font-schoolbell",
  subsets: ["latin"],
  weight: "400",
});


export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Art and projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${geistSans.variable} ${geistMono.variable} ${fredoka.variable} ${schoolbell.variable}`}
    >
      <body className="h-full antialiased font-body">
        {/* <AuthProvider> */}
        <LandscapeGuard>
          <div className="flex h-full flex-col">
            <main className="flex flex-1 flex-col items-center justify-center">
              {children}
            </main>
          </div>
        </LandscapeGuard>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
