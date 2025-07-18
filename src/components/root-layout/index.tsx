"use client";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { getI18nInstance } from "@/src/api/i18n/i18next";
import { dir } from "i18next";
import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

type RootLayoutProps = {
  lng: string;
  children: React.ReactElement;
};

export const RootLayout = ({ children, lng }: RootLayoutProps) => {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-muted font-sans antialiased")}
      >
        <Suspense>
          <I18nextProvider i18n={getI18nInstance(lng)}>
            <main>
              {children}
              <Toaster />
            </main>
          </I18nextProvider>
        </Suspense>
      </body>
    </html>
  );
};
