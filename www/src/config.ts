export const SITE = {
  title: "ShipSpeed",
  description:
    "The fastest way to start a production-ready Next.js app with Better Auth, shadcn/ui, payments, and more.",
  defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
  image: {
    src: "images/og-image.png",
    alt: "ShipSpeed: The fastest way to start a production-ready Next.js app.",
  },
  twitter: "rbnog",
};

// This is the type of the frontmatter you put in the docs markdown files.
export interface Frontmatter {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: "ltr" | "rtl";
  ogLocale?: string;
  lang?: KnownLanguageCode;
  isMdx?: boolean;
}

export const KNOWN_LANGUAGES = {
  // Add more languages here
  // sv: "Svenska",
  ar: "العربية",
  en: "English",
  es: "Español",
  fr: "Français",
  ja: "日本語",
  pt: "Português",
  ru: "Русский",
  no: "Norsk",
  pl: "Polski",
  uk: "Українська",
  "zh-hans": "简体中文",
} as const;
export type KnownLanguageCode = keyof typeof KNOWN_LANGUAGES;

export const GITHUB_EDIT_URL = `https://github.com/rbnog/shipspeed/tree/main/www`;

export const COMMUNITY_INVITE_URL = `https://github.com/rbnog/shipspeed/discussions`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: "shipspeed",
  appId: "0LE5592BV4",
  apiKey: "892c4647b96fe1b3d0b7d8de1c5b5e40",
};

export type OuterHeaders = "ShipSpeed" | "Deployment" | "Usage";

export interface SidebarItem<
  TCode extends KnownLanguageCode = KnownLanguageCode,
> {
  text: string;
  link: `${TCode}/${string}`;
}

export type SidebarItemLink = SidebarItem["link"];

export type Sidebar = {
  [TCode in KnownLanguageCode]: {
    [THeader in OuterHeaders]?: SidebarItem<TCode>[];
  };
};
export const SIDEBAR: Sidebar = {
  // For Translations:
  // Keep the "outer headers" in English so we can match them.
  // Translate the "inner headers" to the language you're translating to.
  // Omit any files you haven't translated, they'll fallback to English.
  // Example:
  // sv: {
  //   "ShipSpeed": [
  //     { text: "Introduktion", link: "sv/introduction" },
  //     { text: "Installation", link: "sv/installation" },
  //   ],
  //   Usage: [{ text: "Miljövariabler", link: "sv/usage/env-variables" }],
  // },
  ar: {
    ShipSpeed: [
      { text: "مُقدمة", link: "ar/introduction" },
      { text: "لماذا CT3A؟", link: "ar/why" },
      { text: "التثبيت", link: "ar/installation" },
      { text: "(Pages)بِنية المجلد", link: "ar/folder-structure-pages" },
      { text: "أسئلة شائعة", link: "ar/faq" },
      { text: "اعمال بواسطة T3", link: "ar/t3-collection" },
      { text: "ترشيحات أُخري", link: "ar/other-recs" },
    ],
    Usage: [
      { text: "الخُطوات الأُولي", link: "ar/usage/first-steps" },
      { text: "Next.js", link: "ar/usage/next-js" },
      { text: "TypeScript", link: "ar/usage/typescript" },
      { text: "tRPC", link: "ar/usage/trpc" },
      { text: "Prisma", link: "ar/usage/prisma" },
      { text: "NextAuth.js", link: "ar/usage/next-auth" },
      {
        text: "Environment Variables",
        link: "ar/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "ar/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "ar/deployment/vercel" },
      { text: "Docker", link: "ar/deployment/docker" },
    ],
  },
  en: {
    ShipSpeed: [
      { text: "Introduction", link: "en/introduction" },
      { text: "Installation", link: "en/installation" },
      { text: "Folder Structure (App)", link: "en/folder-structure-app" },
      { text: "FAQ", link: "en/faq" },
      { text: "Better Auth", link: "en/shipspeed/better-auth" },
      { text: "shadcn/ui", link: "en/shipspeed/shadcn" },
      { text: "Polar Payments", link: "en/shipspeed/polar" },
      { text: "Resend Emails", link: "en/shipspeed/resend" },
      { text: "Admin Dashboard", link: "en/shipspeed/admin-dashboard" },
    ],
    Usage: [
      { text: "First Steps", link: "en/usage/first-steps" },
      { text: "Next.js", link: "en/usage/next-js" },
      { text: "TypeScript", link: "en/usage/typescript" },
      { text: "tRPC", link: "en/usage/trpc" },
      { text: "Drizzle", link: "en/usage/drizzle" },
      { text: "Prisma", link: "en/usage/prisma" },
      { text: "NextAuth.js", link: "en/usage/next-auth" },
      {
        text: "Environment Variables",
        link: "en/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "en/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "en/deployment/vercel" },
      { text: "Netlify", link: "en/deployment/netlify" },
      { text: "Docker", link: "en/deployment/docker" },
    ],
  },
  es: {
    ShipSpeed: [
      { text: "Introducción", link: "es/introduction" },
      { text: "Instalación", link: "es/installation" },
      { text: "Preguntas Frecuentes", link: "es/faq" },
    ],
    Usage: [
      { text: "Primeros Pasos", link: "es/usage/first-steps" },
      { text: "Next.js", link: "es/usage/next-js" },
      { text: "TypeScript", link: "es/usage/typescript" },
      { text: "tRPC", link: "es/usage/trpc" },
      { text: "Prisma", link: "es/usage/prisma" },
      { text: "NextAuth.js", link: "es/usage/next-auth" },
      { text: "Variables de Entorno", link: "es/usage/env-variables" },
      { text: "Tailwind CSS", link: "es/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "es/deployment/vercel" },
      { text: "Netlify", link: "es/deployment/netlify" },
      { text: "Docker", link: "es/deployment/docker" },
    ],
  },
  ja: {
    ShipSpeed: [
      { text: "イントロダクション", link: "ja/introduction" },
      { text: "インストール", link: "ja/installation" },
      { text: "FAQ", link: "ja/faq" },
    ],
    Usage: [
      { text: "はじめの一歩", link: "ja/usage/first-steps" },
      { text: "Next.js", link: "ja/usage/next-js" },
      { text: "TypeScript", link: "ja/usage/typescript" },
      { text: "tRPC", link: "ja/usage/trpc" },
      { text: "Prisma", link: "ja/usage/prisma" },
      { text: "NextAuth.js", link: "ja/usage/next-auth" },
      {
        text: "環境変数",
        link: "ja/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "ja/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "ja/deployment/vercel" },
      { text: "Netlify", link: "ja/deployment/netlify" },
      { text: "Docker", link: "ja/deployment/docker" },
    ],
  },
  pl: {
    ShipSpeed: [
      { text: "Wstęp", link: "pl/introduction" },
      { text: "Instalacja", link: "pl/installation" },
      { text: "FAQ", link: "pl/faq" },
    ],
    Usage: [
      { text: "Pierwsze Kroki", link: "pl/usage/first-steps" },
      { text: "Next.js", link: "pl/usage/next-js" },
      { text: "TypeScript", link: "pl/usage/typescript" },
      { text: "tRPC", link: "pl/usage/trpc" },
      { text: "Prisma", link: "pl/usage/prisma" },
      { text: "NextAuth.js", link: "pl/usage/next-auth" },
      {
        text: "Zmienne Środowiskowe",
        link: "pl/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "pl/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "pl/deployment/vercel" },
      { text: "Netlify", link: "pl/deployment/netlify" },
      { text: "Docker", link: "pl/deployment/docker" },
    ],
  },
  uk: {
    ShipSpeed: [
      { text: "Вступ", link: "uk/introduction" },
      { text: "Встановлення", link: "uk/installation" },
      { text: "FAQ", link: "uk/faq" },
    ],
    Usage: [
      { text: "Перші кроки", link: "uk/usage/first-steps" },
      { text: "Next.js", link: "uk/usage/next-js" },
      { text: "TypeScript", link: "uk/usage/typescript" },
      { text: "tRPC", link: "uk/usage/trpc" },
      { text: "Drizzle", link: "uk/usage/drizzle" },
      { text: "Prisma", link: "uk/usage/prisma" },
      { text: "NextAuth.js", link: "uk/usage/next-auth" },
      {
        text: "Змінні середовища",
        link: "uk/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "uk/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "uk/deployment/vercel" },
      { text: "Netlify", link: "uk/deployment/netlify" },
      { text: "Docker", link: "uk/deployment/docker" },
    ],
  },
  fr: {
    ShipSpeed: [
      { text: "Introduction", link: "fr/introduction" },
      { text: "Installation", link: "fr/installation" },
      { text: "FAQ", link: "fr/faq" },
    ],
    Usage: [
      { text: "Premiers pas", link: "fr/usage/first-steps" },
      { text: "Next.js", link: "fr/usage/next-js" },
      { text: "TypeScript", link: "fr/usage/typescript" },
      { text: "tRPC", link: "fr/usage/trpc" },
      { text: "Prisma", link: "fr/usage/prisma" },
      { text: "NextAuth.js", link: "fr/usage/next-auth" },
      {
        text: "Variables d'environnement",
        link: "fr/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "fr/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "fr/deployment/vercel" },
      { text: "Netlify", link: "fr/deployment/netlify" },
      { text: "Docker", link: "fr/deployment/docker" },
    ],
  },
  pt: {
    ShipSpeed: [
      { text: "Introdução", link: "pt/introduction" },
      { text: "Instalação", link: "pt/installation" },
      { text: "Perguntas Frequentes", link: "pt/faq" },
    ],
    Usage: [
      { text: "Primeiros Passos", link: "pt/usage/first-steps" },
      { text: "Next.js", link: "pt/usage/next-js" },
      { text: "TypeScript", link: "pt/usage/typescript" },
      { text: "tRPC", link: "pt/usage/trpc" },
      { text: "Prisma", link: "pt/usage/prisma" },
      { text: "NextAuth.js", link: "pt/usage/next-auth" },
      {
        text: "Variáveis de Ambiente",
        link: "pt/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "pt/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "pt/deployment/vercel" },
      { text: "Netlify", link: "pt/deployment/netlify" },
      { text: "Docker", link: "pt/deployment/docker" },
    ],
  },
  ru: {
    ShipSpeed: [
      { text: "Введение", link: "ru/introduction" },
      { text: "Установка", link: "ru/installation" },
      { text: "FAQ", link: "ru/faq" },
    ],
    Usage: [
      { text: "Первые шаги", link: "ru/usage/first-steps" },
      { text: "Next.js", link: "ru/usage/next-js" },
      { text: "TypeScript", link: "ru/usage/typescript" },
      { text: "tRPC", link: "ru/usage/trpc" },
      { text: "Prisma", link: "ru/usage/prisma" },
      { text: "NextAuth.js", link: "ru/usage/next-auth" },
      {
        text: "Переменные среды",
        link: "ru/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "ru/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "ru/deployment/vercel" },
      { text: "Docker", link: "ru/deployment/docker" },
      { text: "Netlify", link: "ru/deployment/netlify" },
    ],
  },
  no: {
    ShipSpeed: [
      { text: "Introduksjon", link: "no/introduction" },
      { text: "Installasjon", link: "no/installation" },
      { text: "FAQ", link: "no/faq" },
    ],
    Usage: [
      { text: "Første Steg", link: "no/usage/first-steps" },
      { text: "Next.js", link: "no/usage/next-js" },
      { text: "TypeScript", link: "no/usage/typescript" },
      { text: "tRPC", link: "no/usage/trpc" },
      { text: "Prisma", link: "no/usage/prisma" },
      { text: "NextAuth.js", link: "no/usage/next-auth" },
      {
        text: "Miljøvariabler",
        link: "no/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "no/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "no/deployment/vercel" },
      { text: "Netlify", link: "no/deployment/netlify" },
      { text: "Docker", link: "no/deployment/docker" },
    ],
  },
  "zh-hans": {
    ShipSpeed: [
      { text: "简介", link: "zh-hans/introduction" },
      { text: "安装", link: "zh-hans/installation" },
      { text: "常见疑问", link: "zh-hans/faq" },
    ],
    Usage: [
      { text: "第一步", link: "zh-hans/usage/first-steps" },
      { text: "Next.js", link: "zh-hans/usage/next-js" },
      { text: "TypeScript", link: "zh-hans/usage/typescript" },
      { text: "tRPC", link: "zh-hans/usage/trpc" },
      { text: "Drizzle", link: "zh-hans/usage/drizzle" },
      { text: "Prisma", link: "zh-hans/usage/prisma" },
      { text: "NextAuth.js", link: "zh-hans/usage/next-auth" },
      {
        text: "环境变量",
        link: "zh-hans/usage/env-variables",
      },
      { text: "Tailwind CSS", link: "zh-hans/usage/tailwind" },
    ],
    Deployment: [
      { text: "Vercel", link: "zh-hans/deployment/vercel" },
      { text: "Netlify", link: "zh-hans/deployment/netlify" },
      { text: "Docker", link: "zh-hans/deployment/docker" },
    ],
  },
};

export const SIDEBAR_HEADER_MAP: Record<
  KnownLanguageCode,
  Partial<Record<OuterHeaders, string>>
> = {
  en: {
    ShipSpeed: "ShipSpeed",
    Usage: "Usage",
    Deployment: "Deployment",
  },
  es: {
    ShipSpeed: "ShipSpeed",
    Usage: "Uso",
    Deployment: "Despliegue",
  },
  // Translate the sidebar's "outer headers" here
  // sv: {
  //   "ShipSpeed": "ShipSpeed",
  //   Usage: "Användarguide",
  //   Deployment: "Deployment",
  // },
  ja: {
    ShipSpeed: "ShipSpeed",
    Usage: "使用法",
    Deployment: "デプロイ",
  },
  pl: {
    ShipSpeed: "ShipSpeed",
    Usage: "Korzystanie Z Narzędzia",
    Deployment: "Deployment",
  },
  uk: {
    ShipSpeed: "ShipSpeed",
    Usage: "Використання",
    Deployment: "Деплоймент",
  },
  ar: {
    ShipSpeed: "ShipSpeed",
    Usage: "كيفية الإستخدام؟",
    Deployment: "نَشر تطبيقك",
  },
  fr: {
    ShipSpeed: "ShipSpeed",
    Usage: "Utilisation",
    Deployment: "Déploiement",
  },
  pt: {
    ShipSpeed: "ShipSpeed",
    Usage: "Uso",
    Deployment: "Deploy",
  },
  ru: {
    ShipSpeed: "ShipSpeed",
    Usage: "Использование",
    Deployment: "Развертывание",
  },
  no: {
    ShipSpeed: "ShipSpeed",
    Usage: "Bruk",
    Deployment: "Utrulling",
  },
  "zh-hans": {
    ShipSpeed: "ShipSpeed",
    Usage: "用法",
    Deployment: "部署",
  },
};
