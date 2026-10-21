import { TRANSLATIONS } from './translations.js';

let currentLang = localStorage.getItem('neurolab_lang') || 'es';
const listeners = new Set();

/**
 * Obtener el idioma activo ('es' | 'en')
 */
export function getLang() {
  return currentLang;
}

/**
 * Cambiar el idioma activo y notificar a los oyentes
 */
export function setLang(lang) {
  if (lang !== 'es' && lang !== 'en') return;
  currentLang = lang;
  try {
    localStorage.setItem('neurolab_lang', lang);
  } catch (e) {
    // Ignore storage errors in restricted contexts
  }
  listeners.forEach(fn => {
    try {
      fn(currentLang);
    } catch (err) {
      console.error('Error in i18n listener:', err);
    }
  });
}

/**
 * Suscribirse a cambios de idioma
 */
export function onLangChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Función de traducción jerárquica con soporte para interpolación {key}
 * Ej: t('nav.mlp') o t('microscope.inputTitle', { name: 'Glucosa' })
 */
export function t(path, params = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['es'];
  const keys = path.split('.');
  
  let val = dict;
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) {
      val = val[k];
    } else {
      // Fallback a español si no existe en inglés
      let fallbackVal = TRANSLATIONS['es'];
      for (const fk of keys) {
        if (fallbackVal && typeof fallbackVal === 'object' && fk in fallbackVal) {
          fallbackVal = fallbackVal[fk];
        } else {
          fallbackVal = undefined;
          break;
        }
      }
      val = fallbackVal !== undefined ? fallbackVal : path;
      break;
    }
  }

  if (typeof val !== 'string') {
    return val;
  }

  // Interpolar variables {var}
  return val.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? params[key] : `{${key}}`;
  });
}

/**
 * Traduce todos los elementos del DOM marcados con:
 * - data-i18n="ruta.traduccion" (actualiza textContent)
 * - data-i18n-html="ruta.traduccion" (actualiza innerHTML)
 * - data-i18n-attr="title:ruta.title;placeholder:ruta.placeholder"
 */
export function applyStaticTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });

  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attrPairs = el.getAttribute('data-i18n-attr').split(';');
    for (const pair of attrPairs) {
      const [attrName, key] = pair.split(':');
      if (attrName && key) {
        el.setAttribute(attrName.trim(), t(key.trim()));
      }
    }
  });

  // Actualizar atributo lang en <html>
  document.documentElement.lang = currentLang;
}
