// app/layout.js - FIXED
import { Work_Sans } from 'next/font/google';
import "./globals.css";
import { AuthContextProvider } from './contexts/AuthContext';

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata = {
  icons: { icon: '/regular.ico' },
  title: "WhatToWatch",
  description: "A theatre of experience for an audience of movie lovers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} antialiased`}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
