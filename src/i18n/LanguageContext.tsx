import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface I18nContextProps {
  language: string;
  changeLanguage: (lng: string) => void;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    const current_lang = await localStorage.getItem('lang')
    if (!current_lang){
      localStorage.setItem('lang', 'en')
    }
    localStorage.setItem('lang', lng)
    i18n.changeLanguage(lng); // Thay đổi ngôn ngữ
  };

  return (
    <I18nContext.Provider value={{ language: i18n.language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextProps => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
