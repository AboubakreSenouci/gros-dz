"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import {

  ChevronRight,

} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BrandSection = () => {
  const { t } = useTranslation("home");
  return (
    <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white">
      <div className="absolute inset-0 bg-black opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t("hero_main_title")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {t("hero_tagline")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              {t("hero_cta_discover")}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              {t("hero_cta_register")}
            </Button>
          </div>
        </div>
      </div>
    </section>

  )
}