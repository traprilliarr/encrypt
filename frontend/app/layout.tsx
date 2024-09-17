import type { Metadata } from "next";
import getSession from "./actions/getSession";
import AuthContextProvider from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import RootWrapper from "./wrapper";


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
      <body>
        <AuthContextProvider>
          <ToasterContext />
          <RootWrapper>{children}</RootWrapper>
        </AuthContextProvider>
      </body>
    </html>
  );
}
