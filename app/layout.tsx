"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (t: string) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (t === "dark") {
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#ffffff");
      root.style.setProperty("--dot-color", "rgba(255,255,255,0.07)");
      root.style.setProperty("--glow-top", "rgba(120,120,140,0.08)");
      root.style.setProperty("--glow-bottom", "rgba(100,100,130,0.06)");
    } else {
      root.style.setProperty("--background", "#f5f5f7");
      root.style.setProperty("--foreground", "#1a1a1a");
      root.style.setProperty("--dot-color", "rgba(0,0,0,0.18)");
      root.style.setProperty("--glow-top", "rgba(100,110,180,0.22)");
      root.style.setProperty("--glow-bottom", "rgba(120,100,200,0.16)");
    }
  };

  const isDarkMode = theme === "dark";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Glow orbs — purely decorative, behind all content */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Top center glow */}
          <div style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "70vw",
            height: "60vh",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, var(--glow-top) 0%, transparent 70%)`,
            transition: "background 500ms",
          }} />
          {/* Bottom right glow */}
          <div style={{
            position: "absolute",
            bottom: "10%",
            right: "-5%",
            width: "50vw",
            height: "50vh",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, var(--glow-bottom) 0%, transparent 70%)`,
            transition: "background 500ms",
          }} />
        </div>

        {/* FLOATING THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-[100] p-3 rounded-full border backdrop-blur-md shadow-md hover:scale-110 active:scale-95 transition-all duration-300"
          style={{
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
            color: isDarkMode ? "#ffffff" : "#1a1a1a",
          }}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21M5.81 18.19l1.59-1.59m12.38-12.38l1.59-1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>

        {/* Page content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>

      </body>
    </html>
  );
}