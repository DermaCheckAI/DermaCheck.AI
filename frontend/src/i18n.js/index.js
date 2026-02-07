import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "../translations/english.json"   // CHANGED
import mr from "../translations/marathi.json"   // CHANGED

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    mr: { translation: mr }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
})

export default i18n
