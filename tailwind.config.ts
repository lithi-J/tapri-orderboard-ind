import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
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
        chai: {
          DEFAULT: "hsl(var(--chai))",
          deep: "hsl(var(--chai-deep))",
          foam: "hsl(var(--chai-foam))",
        },
        cream: "hsl(var(--cream))",
        saffron: {
          DEFAULT: "hsl(var(--saffron))",
          glow: "hsl(var(--saffron-glow))",
        },
        neon: {
          DEFAULT: "hsl(var(--neon))",
          glow: "hsl(var(--neon-glow))",
        },
        urgent: "hsl(var(--urgent))",
        chalkboard: "hsl(var(--chalkboard))",
      },
      backgroundImage: {
        'gradient-chai': 'var(--gradient-chai)',
        'gradient-saffron': 'var(--gradient-saffron)',
        'gradient-cream': 'var(--gradient-cream)',
        'gradient-neon': 'var(--gradient-neon)',
      },
      boxShadow: {
        warm: 'var(--shadow-warm)',
        card: 'var(--shadow-card)',
        'glow-neon': 'var(--shadow-glow-neon)',
        'glow-urgent': 'var(--shadow-glow-urgent)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "bounce-in": { "0%": { transform: "scale(0.3)", opacity: "0" }, "50%": { transform: "scale(1.05)" }, "70%": { transform: "scale(0.95)" }, "100%": { transform: "scale(1)", opacity: "1" } },
        "count-pop": { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.3)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)",
        "count-pop": "count-pop 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
