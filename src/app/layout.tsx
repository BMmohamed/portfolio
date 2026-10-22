import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import SplashScreen from "@/components/SplashScreen";
import OfflineDetector from "@/components/OfflineDetector";
import NativeAppExperience from "@/components/NativeAppExperience";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "رؤية العقارية | بوابتك للعقارات الفاخرة والاستثمار الموثوق",
    template: "%s | رؤية العقارية",
  },
  description: "الشركة الرائدة في الوساطة والتسويق العقاري في سوريا. نوفر أفضل الفلل، الشقق، والأراضي السكنية والتجارية في دمشق، ريف دمشق، حلب، واللاذقية.",
  applicationName: "رؤية العقارية",
  keywords: [
    "عقارات سوريا",
    "شقق للبيع دمشق",
    "فلل للبيع يعفور",
    "عقارات اللاذقية",
    "طابو أخضر",
    "وساطة عقارية سوريا",
    "تسويق عقاري",
    "استثمار عقاري",
  ],
  authors: [{ name: "رؤية العقارية" }],
  creator: "رؤية العقارية",
  publisher: "رؤية العقارية",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "رؤية العقارية",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-slate-50 text-slate-800 selection:bg-amber-500 selection:text-white w-full max-w-full overflow-x-clip">
        <NativeAppExperience />
        <SplashScreen />
        <OfflineDetector />
        <ServiceWorkerRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
