import { useEffect, useState } from "react";

export default function Translate() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Force CSS to hide the banner and fix the layout
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      body { top: 0 !important; position: static !important; }
      .skiptranslate { display: none !important; }
      #google_translate_element { display: none !important; }
    `;
    document.head.appendChild(style);

    // 2. Pre-load the script so it's ready when the user clicks
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

    // Helper function to find and trigger the Google select box
    const triggerGoogleTranslate = () => {
      const googleSelect = document.querySelector(".goog-te-combo");
      if (googleSelect) {
        googleSelect.value = lang;
        googleSelect.dispatchEvent(new Event("change"));
      } else {
        // If the select isn't in the DOM yet, try again in 500ms
        setTimeout(triggerGoogleTranslate, 500);
      }
    };

    triggerGoogleTranslate();
  };

  return (
    <div className="translate-container" style={{ position: 'relative', zIndex: 1000 }}>
      <select
        onChange={changeLanguage}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          outline: "none"
        }}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
      </select>

      {/* Hidden container for Google's internal elements */}
      <div id="google_translate_element" style={{ visibility: "hidden", position: "absolute" }}></div>
    </div>
  );
}