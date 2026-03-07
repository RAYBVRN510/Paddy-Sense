import "../globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "PaddySense - Rice Leaf Disease Detection",
  description: "AI-powered rice leaf disease detection for farmers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen">
            <Navigation />
            <main className="page-shell">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
