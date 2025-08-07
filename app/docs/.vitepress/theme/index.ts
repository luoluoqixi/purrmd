import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const storageKey = 'lang-save-key';
const supportedLangs = ['zh'];

const defaultLang = 'en';

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    if (typeof window === 'undefined') return;

    app.use({
      install() {
        // localStorage.removeItem(storageKey);
      },
    });

    router.onAfterRouteChange = (to) => {
      let lang: string | undefined = '';
      const paths = to.split('/');
      if (paths.length > 1) {
        const currentLang = paths[1];
        if (supportedLangs.includes(currentLang)) {
          lang = currentLang;
        }
      }

      const saveLang = localStorage.getItem(storageKey);
      if (saveLang == null) {
        const language = navigator.language;
        if (language && language.length > 2) {
          const userLang = language.substring(0, 2);
          if (supportedLangs.includes(userLang)) {
            let targetTo = to;
            if (lang.length > 0) {
              targetTo = targetTo.substring(lang.length + 1);
            }
            router.go(`/${userLang}${targetTo}`);
          }
        }
      }
      if (lang === saveLang) {
        return;
      }
      if (lang !== saveLang) {
        localStorage.setItem(storageKey, lang);
        console.log('Language changed to:', lang === '' ? defaultLang : lang);
      }
    };
  },
} satisfies Theme;
