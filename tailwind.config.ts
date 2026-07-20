import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#C81E2A", // primary CTA / accent (Book a Stay, active nav underline)
        ink: "#1E1F22", // primary text
        paper: "#FFFFFF",
        mist: "#F4F4F5",
        mist2: "#E7E9EB",
        mist3: "#EEF0F1",
        gold: "#D4AF37", // sparing accents
      },
      fontFamily: {
        // CSS variables provided by next/font in app/layout.tsx
        cinzel: ["var(--font-cinzel)", "serif"], // display / headings
        lato: ["var(--font-lato)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.16,1,0.3,1)", // CTA / hover / nav transitions
      },
    },
  },
  plugins: [],
};

export default config;
