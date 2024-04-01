import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Azv Management",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"font-inter flex bg-secondary text-textBlack"}>
        {children}
      </body>
    </html>
  );
}
