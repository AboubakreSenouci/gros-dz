"use client"
import React from 'react';
import { useTranslation } from 'react-i18next';

export const TrustedBySection = () => {
  const { t } = useTranslation("home");
  return (
    <section id="trusted-by" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("trusted_heading")}
          </h2>
          <p className="text-xl text-gray-600">
            {t("trusted_subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
