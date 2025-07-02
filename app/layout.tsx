import "@/app/ui/styles/global.css";
import { inter } from "./ui/common/fonts";

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
