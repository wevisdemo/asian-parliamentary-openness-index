import { env } from '$env/dynamic/public';

export const siteName = 'Asian Parliamentary Openness Index';
export const siteUrl = env.PUBLIC_SITE_URL ?? 'http://localhost:5173';
export const isProduction = env.PUBLIC_ENVIRONMENT === 'production';
export const siteTagline = 'A regional index tracking how openly Asia-Pacific parliaments operate.';
