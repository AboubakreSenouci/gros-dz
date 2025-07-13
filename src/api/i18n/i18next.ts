import i18nBase, { Module } from "i18next";
import { AR } from "./locales/ar";
import { EN } from "./locales/en";
import { FR } from "./locales/fr";
import { initReactI18next } from "react-i18next";

export const resources = {
  ar: AR,
  en: EN,
  fr: FR,
};
export const supportedLngs = Object.keys(resources);

type SupportedLanguage = 'ar' | 'en' | 'fr';
const I18nCookieKey = 'i18next';
type LanguageResources = typeof EN;

const dynamicBackend: Module = {
  // @ts-expect-error wrong type here. Please fix it later
  read: (language: string, namespace: string, callback) => {
    import(`./${language}/${namespace}.json`)
      .then((loadedResources) => callback(null, loadedResources))
      .catch((error) => callback(error, false));
  },
  type: "backend",
};

let i18n = i18nBase.createInstance();

const initializeNewI18nInstance = () => {
  i18n = i18nBase.createInstance();
  return i18n;
};

const getI18nInstance = (lng: string) => {
  const i18n = initializeNewI18nInstance();
  void i18n.use(initReactI18next).init({
    fallbackLng: false,
    initAsync: false,
    interpolation: {
      escapeValue: false,
    },
    lng,
    react: {
      useSuspense: false,
    },
    resources,
    supportedLngs,
  });
  return i18n;
};

const setLanguageCookie = (lng: SupportedLanguage) => {
  document.cookie = `i18next=${lng}; max-age=31536000; path=/`;
}

export type {
  LanguageResources,
  SupportedLanguage
}

export {
  I18nCookieKey,
  getI18nInstance,
  setLanguageCookie
}
