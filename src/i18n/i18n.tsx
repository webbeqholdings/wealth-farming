import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import chuỗi dịch
import { en } from './loc/en';
import { vi } from './loc/vi';
const savedLanguage = localStorage.getItem('i18n_language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en, // Gán chuỗi dịch tiếng Anh
    },
    vi: {
      translation: vi, // Gán chuỗi dịch tiếng Việt
    },
  },
  lng: savedLanguage, // Ngôn ngữ mặc định
  supportedLngs: ['en', 'vi'],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React đã tự xử lý escape
  },
});
export default i18n;
//
//    { data: "dữ liệu" ,...}
//    
//    import { useTranslation } from 'react-i18next';
//    const { t } = useTranslation(); 
//      t('data') => dữ liệu
//     