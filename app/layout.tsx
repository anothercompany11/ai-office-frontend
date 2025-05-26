import localFont from "next/font/local";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import { Metadata } from "next";

const hakgyoAnsim = localFont({
  src: [
    {
      path: "./font/Hakgyoansim-Allimjang-TTF-R.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font/Hakgyoansim-Allimjang-TTF-B.woff",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-hakgyonansim",
});

const pretendard = localFont({
  src: [
    {
      path: "./font/Pretendard-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font/Pretendard-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./font/Pretendard-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./font/Pretendard-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./font/Pretendard-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "토르",
  description: "토르",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${hakgyoAnsim.variable} font-pretendard`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
