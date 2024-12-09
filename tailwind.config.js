/* eslint-disable no-undef */
/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,astro}",
    "./components/**/*.{ts,tsx,astro}",
    "./app/**/*.{ts,tsx,astro}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {
        "calc-half": "calc(50% - 2rem)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        ship: {
          "0%": { opacity: "1", transform: "translateY(5%) translateX(-150%) rotate(2deg)" },
          "10%": { opacity: "1", transform: "translateY(-5%) translateX(-120%) rotate(-2deg)" },
          "20%": { opacity: "1", transform: "translateY(5%) translateX(-90%) rotate(2deg)" },
          "30%": { opacity: "1", transform: "translateY(-5%) translateX(-60%) rotate(-2deg)" },
          "40%": { opacity: "1", transform: "translateY(5%) translateX(-30%) rotate(2deg)" },
          "50%": { opacity: "1", transform: "translateY(-5%) translateX(0%) rotate(-2deg)" },
          "60%": { opacity: "1", transform: "translateY(5%) translateX(30%) rotate(2deg)" },
          "70%": { opacity: "1", transform: "translateY(-5%) translateX(60%) rotate(-2deg)" },
          "80%": { opacity: "1", transform: "translateY(5%) translateX(90%) rotate(2deg)" },
          "90%": { opacity: "1", transform: "translateY(-5%) translateX(120%) rotate(-2deg)" },
          "100%": { opacity: "1", transform: "translateY(5%) translateX(150%) rotate(2deg)" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-236px * 4))" }, // 자격증 개수 * 236px
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        ship: "ship 4s linear infinite",
        scroll: "scroll 15s linear infinite",
      },
      backgroundImage: {
        "wave-pattern": "repeating-linear-gradient(45deg, rgba(0, 0, 255, 0.5), rgba(0, 0, 255, 0.5) 20px, rgba(0, 0, 255, 0.3) 20px, rgba(0, 0, 255, 0.3) 40px)",
      },
      fontFamily: {
        noto: ["Noto Sans KR", "sans-serif"],
      },
      boxShadow: {
        "white-2xl": "0 25px 50px -12px rgb(255 255 255 / 0.25);"
      }
    },
  },
  variants: {
    extend: {
      filter: ["responsive", "hover", "focus"],
    },
  },
  plugins: [require("tailwindcss-animate")],
  // disable tailwind preflight: https://tailwindcss.com/docs/preflight
  // corePlugins: {
  // preflight: false,
  // },
};
