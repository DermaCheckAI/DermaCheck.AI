import { useEffect, useState } from "react";

export default function Translate() {
  const [loaded, setLoaded] = useState(false);

  // ✅ Correct place for observer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector("iframe.goog-te-banner-frame");

      if (iframe) {
        iframe.style.display = "none";
      }

      document.body.style.top = "0px";
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const loadScript = () => {
    if (!loaded) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;

      document.body.appendChild(script);
      setLoaded(true);
    }
  };

  const changeLanguage = (e) => {
    loadScript();

    const lang = e.target.value;
    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <>
      <select
        onClick={loadScript}
        onChange={changeLanguage}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        <option value="">🌐 Language</option>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
      </select>

      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  );
}