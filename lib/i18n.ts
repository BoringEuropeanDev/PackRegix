import { cookies, headers } from 'next/headers';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

export type Locale = 'en' | 'fr' | 'de';

const dictionaries = { en, fr, de };

export async function getLocaleFromHeader(): Promise<Locale> {
  const cookieLocale = (await cookies()).get('packregix_locale')?.value as Locale | undefined;
  if (cookieLocale && ['en','fr','de'].includes(cookieLocale)) return cookieLocale;
  const accept = (await headers()).get('accept-language')?.toLowerCase() || 'en';
  if (accept.includes('fr')) return 'fr';
  if (accept.includes('de')) return 'de';
  return 'en';
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries.en;
}
