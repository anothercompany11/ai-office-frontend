import localFont from "next/font/local";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "AI Office",
  description: "AI Office Frontend",
};

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
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
