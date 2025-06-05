"use client";

import { AppHeader } from "@/components/app-header";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
