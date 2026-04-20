import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cache } from "react";
import "./globals.css";
import { ReduxProvider } from "./store/ReduxProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { supabaseAdmin as supabase } from "@/config/db";
import { ToastContainer } from "@/components/ui/Toast";
import { SessionManager } from "@/components/auth/SessionManager";
import { ErrorBoundary } from "@/components/error";
import { getErrorMessage } from "@/types/error";
import { Settings } from "@/types/settings";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const getSettings = cache(async () => {
  try {
    const { data: settings } = await supabase
      .from("app_settings")
      .select("*")
      .maybeSingle();
    return settings as Settings | null;
  } catch (err) {
    console.error("Failed to fetch app settings:", getErrorMessage(err));
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const title = settings?.seo_title || "Aziz Juliansyah Portfolio";
  const description = settings?.seo_description || "Portfolio Aziz Juliansyah";
  const siteName = settings?.seo_site_name || "Aziz Portfolio";
  const type = settings?.seo_type || "website";
  const image = settings?.seo_image || null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName,
      type: type as any,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    formatDetection: {
      telephone: false,
      date: false,
      email: false,
      address: false,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global theme from DB using cached function
  const settings = await getSettings();
  let globalTheme = "system";

  if (settings?.theme) {
    globalTheme = settings.theme;
  }

  // Pre-calculate class to prevent flicker
  let htmlClass = globalTheme === "system" ? "" : globalTheme;
  
  return (
    <html lang="en" suppressHydrationWarning className={htmlClass} style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider defaultTheme={globalTheme as "light" | "dark" | "system"}>
            <ReduxProvider>
              <SessionManager>
                {children}
                <ToastContainer />
                <SpeedInsights />
              </SessionManager>
            </ReduxProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
