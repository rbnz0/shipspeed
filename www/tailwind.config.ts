import scrollbar from "tailwind-scrollbar";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        default: "rgb(var(--color-default) / <alpha-value>)",
        neutral: "rgb(var(--color-neutral) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",

        "ss-purple-50": "#F3EEFF",
        "ss-purple-100": "#e8ddff",
        "ss-purple-200": "#c3b4fc",
        "ss-purple-300": "#9e8bf9",
        "ss-purple-400": "#7a62f6",
        "ss-purple-500": "#5749f3",
        "ss-purple-600": "#4a3eeb",
        "ss-purple-700": "#3d34e3",
        "ss-purple-800": "#3029db",
        "ss-purple-900": "#231ed3",
        "ss-purple-1000": "#1613cb",
      },
      animation: {
        draw: "draw 2s linear normal",
      },
    },
    keyframes: {
      draw: {
        to: { strokeDashoffset: "200" },
      },
    },
    fontFamily: {
      sans: [
        '"InterVariable"',
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ["ui-serif", "Georgia"],
      mono: [
        '"JetBrains Mono"',
        "monospace",
        "ui-monospace",
        "Menlo",
        "Monaco",
        '"Cascadia Mono"',
        '"Segoe UI Mono"',
        '"Roboto Mono"',
        '"Oxygen Mono"',
        '"Ubuntu Monospace"',
        '"Source Code Pro"',
        '"Fira Mono"',
        '"Droid Sans Mono"',
        '"Courier New"',
      ],
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
} satisfies Config;
