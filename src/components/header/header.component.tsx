"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Package, X } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { setLanguageCookie, SupportedLanguage } from "@/src/api/i18n/i18next";
import { toast } from "sonner";
import { Spinner } from "../spinner";
import Link from "next/link";

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation("common");
  const [loading, setLoading] = useState(false);

  const toggleLanguage = async (lng: SupportedLanguage) => {
    setLoading(true);
    try {
      await i18n.changeLanguage(lng);
      setLanguageCookie(lng);
    } catch (_error) {
      toast.error(`Failed to change language to ${lng}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="sm" />
  }

  return (
    <Select
      value={i18n.language}
      onValueChange={toggleLanguage}
      aria-label="Select language"
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation("common");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" dir={i18n.dir()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-destructive" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                MarketPlace.dz
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t("home")}
            </a>
            <a
              href="#products"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t("products")}
            </a>
            <a
              href="#suppliers"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t("suppliers")}
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t("about")}
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t("contact")}
            </a>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="ghost" size="sm">
              <Link href="/signin">
              {t("login")}
              </Link>
            </Button>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              {t("signup")}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
            >
              {t("home")}
            </a>
            <a
              href="#products"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
            >
              {t("products")}
            </a>
            <a
              href="#suppliers"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
            >
              {t("suppliers")}
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
            >
              {t("about")}
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
            >
              {t("contact")}
            </a>
            <div className="px-3 py-2 space-y-2">
              <LanguageSelector />
              <Button variant="ghost" size="sm" className="w-full">
                {t("login")}
              </Button>
              <Button
                size="sm"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {t("signup")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
