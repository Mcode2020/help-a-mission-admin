export const SUPPORTED_LANGUAGES = ['en', 'hi'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिंदी', english: 'Hindi' },
};
