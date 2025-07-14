"use client"
import React from 'react';

import { Header } from '@/src/components';
import {
  HowItWorksSection, BrandSection, CallToActionSection,
  FeaturesSection, TrustedBySection
} from '@/src/features/home/components';

const WholesaleMarketplace = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BrandSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustedBySection />
      <CallToActionSection />
    </div>
  );
};

export default WholesaleMarketplace;
