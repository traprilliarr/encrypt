import type { Metadata } from "next";
import { Inter } from "next/font/google";
import getSession from "./actions/getSession";
import AuthContextProvider from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import RootWrapper from "./wrapper";
import { Suspense } from "react";
import LoadingModal from "./components/LoadingModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: any = await getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <ToasterContext />
          <RootWrapper>{children}</RootWrapper>
        </AuthContextProvider>
      </body>
    </html>
  );
}
