import type { Metadata } from "next";
import { Amaranth } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/ui/nav-bar";

const amaranthType = Amaranth({
  weight:'400',
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "userly",
  description: "userly is a best user management system to effectively handled user with integration of Google Maps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${amaranthType.className} antialiased`}
      >
        <NavBar/>
        {children}
        <div className="mt-10">
        </div>
      </body>
    </html>
  );
}
