
import type { Metadata } from "next";
import "../globals.css"; // Import from src/


export const metadata: Metadata = {
  title: "Campus Hire",
  description: "A platform for campus recruitment and job opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        
        <main>
        {children}
        </main>
       

      </body>
    </html>
  );
}
