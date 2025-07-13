"use client"

import React from 'react';
import {
  UserPlus,
  Search,
  Phone,
} from 'lucide-react';
import { Header } from '@/src/components';
import { useTranslation } from 'react-i18next';


export const HowItWorksSection = () => {
  const { t } = useTranslation("home");
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("how_title")}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="text-center">
              <div
                className={`mx-auto rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 ${step === 1
                    ? 'bg-orange-600'
                    : step === 2
                      ? 'bg-green-600'
                      : 'bg-purple-600'
                  }`}
              >
                {{
                  1: <UserPlus className="h-8 w-8 text-white" />,
                  2: <Search className="h-8 w-8 text-white" />,
                  3: <Phone className="h-8 w-8 text-white" />,
                }[step]}
              </div>
              <div
                className={`${step === 1
                    ? 'bg-orange-600'
                    : step === 2
                      ? 'bg-green-600'
                      : 'bg-purple-600'
                  } text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold`}
              >
                {step}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t(`how_step${step}_title`)}
              </h3>
              <p className="text-gray-600">
                {t(`how_step${step}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

  )
}
