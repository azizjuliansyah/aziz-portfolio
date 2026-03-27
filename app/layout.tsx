import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./store/ReduxProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { supabaseAdmin as supabase } from "@/config/db";
import { ToastContainer } from "@/components/ui/Toast";
import { SessionManager } from "@/components/auth/SessionManager";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aziz Juliansyah Portfolio",
  description: "Portfolio Aziz Juliansyah",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global theme from DB
  let globalTheme = "system";
  try {
    const { data: settings } = await supabase
      .from("app_settings")
      .select("theme, enable_global_theme")
      .maybeSingle(); // Better than single() if row might not exist
      
    if (settings?.theme) {
      globalTheme = settings.theme;
    }
  } catch (err: any) {
    // Fail silently, use system default
    globalTheme = "system";
  }

  // Pre-calculate class to prevent flicker
  let htmlClass = globalTheme === "system" ? "" : globalTheme;
  
  return (
    <html lang="en" suppressHydrationWarning className={htmlClass} style={{ scrollBehavior: 'smooth' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme={globalTheme as any}>
          <ReduxProvider>
            <SessionManager>
              {children}
              <ToastContainer />
            </SessionManager>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
