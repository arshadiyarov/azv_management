import type { Metadata } from "next";
import "../globals.css";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import { ButtonProvider, useButtonContext } from "@/ButtonContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"font-inter flex bg-secondary text-textBlack relative"}>
        <ButtonProvider>{children}</ButtonProvider>
      </body>
    </html>
  );
}
