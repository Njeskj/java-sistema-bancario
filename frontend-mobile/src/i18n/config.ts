import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      login: 'Entrar',
      email: 'Email',
      password: 'Senha',
      register: 'Criar conta',
      dashboard: 'Início',
      transactions: 'Transações',
      payments: 'Pagamentos',
      cards: 'Cartões',
      profile: 'Perfil',
    },
  },
  en: {
    translation: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      register: 'Sign up',
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      payments: 'Payments',
      cards: 'Cards',
      profile: 'Profile',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
