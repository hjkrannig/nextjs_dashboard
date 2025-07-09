import "@/app/ui/styles/global.css";
import { inter } from "./ui/common/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme Dashboard",
    default: "Acme Dashboard",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* <body className={`${inter.className} antialiased `}> */}
      <body className={`${inter.className} antialiased w-[95%] mx-auto bg-slate-100`}>
        {children}
      </body>
    </html>
  );
}
