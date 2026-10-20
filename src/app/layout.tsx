import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "رؤية العقارية | بوابتك للعقارات الفاخرة والاستثمار الموثوق",
  description: "الشركة الرائدة في الوساطة والتسويق العقاري بالمملكة العربية السعودية. نوفر أفضل الفلل، الشقق، والأراضي السكنية والتجارية في الرياض، جدة، والدمام.",
  keywords: "عقارات السعودية, شقق للبيع الرياض, فلل للبيع, عقار للإيجار, وساطة عقارية, ترخيص فال",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-slate-50 text-slate-800 selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
