import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from "react-i18next"
import { MdLanguage } from "react-icons/md"


// import { useLanguage, translations } from '../pages/language.jsx'


// import { MdLanguage } from "react-icons/md"      // ✅ ADD (optional icon)




export default function Navbar({ showRegisterButton = true }) {

    // const { t, i18n } = useTranslation()   // ✅ CHANGED
      const { t, i18n } = useTranslation()               // ✅ CHANGED: using i18next hook

    const [open, setOpen] = useState(false)


  return (
    <nav className="relative z-10 w-full h-20 bg-white/5 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-8">
      
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        DermaCheck.AI
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">

         {/* 🔹 CHANGED: text replaced with t("key") */}
        <Link className="nav-link" to="/">{t("home")}</Link>
        <Link className="nav-link" to="/analysis">{t("analysis")}</Link>
        <Link className="nav-link" to="/history">{t("history")}</Link>
        <Link className="nav-link" to="/suggestions">{t("suggestions")}</Link>
        <Link className="nav-link" to="/dashboard">{t("dashboard")}</Link>

        {/* <Link className="nav-link" to="/">{t.home}</Link>
        <Link className="nav-link" to="/analysis">{t.analysis}</Link>
        <Link className="nav-link" to="/history">{t.history}</Link>
        <Link className="nav-link" to="/suggestions">{t.suggestions}</Link>
        <Link className="nav-link" to="/dashboard">{t.dashboard}</Link> */}



        {/* 🌐 Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="text-xl text-cyan-400 hover:text-cyan-300 transition"
            aria-label="Change Language"
          >
            {/* 🌐 */}
                        <MdLanguage size={24} />  {/* ✅ CHANGED: replaced 🌐 with icon */}

          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-36 bg-gray-900 border border-cyan-400/30 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => {

                                    i18n.changeLanguage("en")       // 🔹 CHANGED


                  // setLang('en')

                  setOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-cyan-500/20"
              >
                English
              </button>

              <button
                onClick={() => {
                  // setLang('mr')
                               i18n.changeLanguage("mr")       // 🔹 CHANGED

                  setOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-cyan-500/20"
              >
                मराठी
              </button>
            </div>
          )}
        </div>

        {/* Register Button */}
        {showRegisterButton && (
          <Link
            to="/register"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center h-fit"
          >
            {/* {t.register} */}
             {t("register")}

          </Link>
        )}
      </div>

    </nav>
  );
}
