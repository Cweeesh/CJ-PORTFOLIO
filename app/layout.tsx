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
  // Set default starting theme to dark to match your portfolio's original state
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    // Update global CSS variables dynamically
    updateThemeVariables(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeVariables(newTheme);
  };

  const updateThemeVariables = (currentTheme: string) => {
    const root = document.documentElement;
    if (currentTheme === "dark") {
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#ffffff");
    } else {
      root.style.setProperty("--background", "#f5f5f7");
      root.style.setProperty("--foreground", "#1a1a1a");
    }
  };

  const isDarkMode = theme === "dark";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* SLEEK FLOATING THEME ICON BUTTON */}
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-[100] p-3 rounded-full border backdrop-blur-md shadow-md hover:scale-110 active:scale-95 transition-all duration-300"
          style={{
            backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
            color: isDarkMode ? "#ffffff" : "#1a1a1a"
          }}
          aria-label="Toggle Theme Layout"
        >
          {isDarkMode ? (
            /* SVG Sun Icon (Clicking switches to light mode) */
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21M5.81 18.19l1.59-1.59m12.38-12.38l1.59-1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
            </svg>
          ) : (
            /* SVG Moon Icon (Clicking switches to dark mode) */
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>

        {children}
      </body>
    </html>
  );
}