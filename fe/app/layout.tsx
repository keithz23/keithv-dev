import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Keith Vuong — Full-stack Developer",
  description:
    "Full-stack developer in Ho Chi Minh City building secure APIs, real-time experiences, and reliable web products with Next.js, NestJS, Redis, and AWS.",
  keywords: [
    "Keith Vuong",
    "Full-stack Developer",
    "Next.js Developer",
    "Web Developer Vietnam",
  ],
  openGraph: {
    title: "Keith Vuong — Full-stack Developer",
    description:
      "Secure APIs, real-time experiences, and reliable web products built with Next.js, NestJS, Redis, and AWS.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
