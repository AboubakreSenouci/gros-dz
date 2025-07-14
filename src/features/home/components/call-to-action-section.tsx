"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CallToActionSection = () => {
  const { t } = useTranslation("home");
  return (
    <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t("cta_main_title")}
        </h2>
        <Button
          size="lg"
          className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg"
        >
          {t("cta_button")}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
