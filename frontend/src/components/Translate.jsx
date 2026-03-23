import { useEffect, useState } from "react";

export default function Translate() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Inject CSS to kill Google's ugly banner and fix the layout
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      body { top: 0 !important; position: static !important; }
      .skiptranslate { display: none !important; }
      #google_translate_element { display: none !important; }
      .goog-te-balloon-frame { display: none !important; }
      #goog-gt-tt { display: none !important; visibility: hidden !important; }
      .goog-text-highlight { background: none !important; box-shadow: none !important; }
      .notranslate { font-family: inherit !important; }
    `;
    document.head.appendChild(style);

    // 2. Initialize Google Translate Script
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      setLoaded(true);
    }
  }, []);

  const changeLanguage = (e) => {
    const lang = e.target.value;
    if (!lang) return;

    // 🔹 FORCE RESET: Clear previous translation cookies
    // This stops the engine from getting "stuck" between English and Hindi
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
    
    // Set the new translation cookie immediately
    document.cookie = `googtrans=/en/${lang}; path=/;`;

    let attempts = 0;
    const maxAttempts = 30; 

    const triggerGoogleTranslate = () => {
      const googleSelect = document.querySelector(".goog-te-combo");
      if (googleSelect) {
        googleSelect.value = lang;
        // 🔹 Use 'bubbles: true' to ensure the internal Google listener catches it
        googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
        
        // Final fallback: tiny scroll to wake up the DOM observer
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(triggerGoogleTranslate, 100);
      }
    };
    triggerGoogleTranslate();
  };

  return (
    <div className="translate-container notranslate group flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700/50 bg-black/20 hover:border-cyan-500/50 hover:bg-black/40 transition-all cursor-pointer" style={{ position: 'relative', zIndex: 1000 }}>
      
      {/* 🌐 Globe Icon */}
      <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9-9H3m9 9V3m0 9L3 3m0 0l9 9" />
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path d="M3.6 9h16.8M3.6 15h16.8" strokeWidth={2} />
        </svg>
      </span>

      {/* Styled Select Dropdown */}
      <select
        onChange={changeLanguage}
        className="notranslate bg-transparent appearance-none border-none text-gray-300 hover:text-cyan-300 font-medium transition-colors cursor-pointer focus:outline-none pr-5 text-xs uppercase tracking-widest"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2322d3ee' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '0.8em',
        }}
      >
        <option value="en" className="bg-gray-900 text-white">English</option>
        <option value="hi" className="bg-gray-900 text-white">Hindi</option>
        <option value="mr" className="bg-gray-900 text-white">Marathi</option>
      </select>

      <div id="google_translate_element" className="hidden absolute opacity-0 pointer-events-none"></div>
    </div>
  );
}