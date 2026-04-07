import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartSidebar } from "@/components/CartSidebar";
import { ThemeProvider } from "@/app/context/ThemeContext";

export const metadata: Metadata = {
  title: "Chopnchop - Scheduled Food Delivery",
  description: "Order your daily meals with guaranteed delivery slots. Zero waste, zero wait.",
};

// Inline script to prevent FOUC (Flash of Unstyled Content) on initial load
const themeInitScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('chopnchop-theme');
      var isDark = savedTheme === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <CartSidebar />
          
          {/* Simple Footer */}
          <footer className="border-t border-secondary-light/20 bg-secondary-light/5 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm font-medium text-foreground/70">
                &copy; {new Date().getFullYear()} Chop<span className="text-primary">n</span>chop. All rights reserved.
              </p>
              <p className="text-xs text-foreground/50 mt-2">
                Lekki • Yaba • Victoria Island
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
