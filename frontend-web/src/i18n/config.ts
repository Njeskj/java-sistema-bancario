import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traduções
import ptBR from './locales/pt-BR.json';
import ptPT from './locales/pt-PT.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'pt-PT': { translation: ptPT },
    },
    lng: localStorage.getItem('language') || 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
