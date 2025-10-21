import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // NHBEA Brand Colors
        "nhbea-royal-blue": "var(--nhbea-royal-blue)",
        "nhbea-royal-blue-dark": "var(--nhbea-royal-blue-dark)",
        "nhbea-royal-blue-deeper": "var(--nhbea-royal-blue-deeper)",
        "nhbea-royal-blue-light": "var(--nhbea-royal-blue-light)",
        "nhbea-royal-blue-lighter": "var(--nhbea-royal-blue-lighter)",
        "nhbea-royal-blue-subtle": "var(--nhbea-royal-blue-subtle)",
        "nhbea-accent-orange": "var(--nhbea-accent-orange)",
        "nhbea-accent-orange-dark": "var(--nhbea-accent-orange-dark)",
        "nhbea-accent-green": "var(--nhbea-accent-green)",
        "nhbea-accent-green-dark": "var(--nhbea-accent-green-dark)",
        "nhbea-accent-purple": "var(--nhbea-accent-purple)",
        "nhbea-accent-gold": "var(--nhbea-accent-gold)",
        "nhbea-accent-gold-dark": "var(--nhbea-accent-gold-dark)",
        "nhbea-gray-50": "var(--nhbea-gray-50)",
        "nhbea-gray-100": "var(--nhbea-gray-100)",
        "nhbea-gray-200": "var(--nhbea-gray-200)",
        "nhbea-gray-300": "var(--nhbea-gray-300)",
        "nhbea-gray-400": "var(--nhbea-gray-400)",
        "nhbea-gray-500": "var(--nhbea-gray-500)",
        "nhbea-gray-600": "var(--nhbea-gray-600)",
        "nhbea-gray-700": "var(--nhbea-gray-700)",
        "nhbea-gray-800": "var(--nhbea-gray-800)",
        "nhbea-gray-900": "var(--nhbea-gray-900)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config