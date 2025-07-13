"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Handshake,
  MessageCircle,

} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FeatureProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}
const Feature: React.FC<FeatureProps> = ({ icon, ...props }) => {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardHeader>
        <div >
          {icon}
        </div>
        <CardTitle className="text-xl">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">
          {props.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export const FeaturesSection = () => {
  const { t } = useTranslation("home");
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("features_heading")}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={
              <div className="mx-auto bg-orange-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4" >
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            }
            title={t("feature_choice_title")}
            description={t("feature_choice_desc")}
          />
          <Feature
            icon={
              <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Handshake className="h-8 w-8 text-green-600" />
              </div>
            }
            title={t("feature_choice_title")}
            description={t("feature_direct_desc")}
          />
          <Feature
            icon={
              <div className="mx-auto bg-purple-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
            }
            title={t("feature_support_title")}
            description={t("feature_support_desc")}
          />

        </div>
      </div>
    </section>
  );
}
