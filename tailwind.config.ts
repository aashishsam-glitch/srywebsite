import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: "#050714",
          800: "#090D23",
          700: "#101638",
        },
        indigoDeep: {
          900: "#0f0b22",
          800: "#171333",
          700: "#221c4b",
        },
        roseSoft: {
          DEFAULT: "#F3A5C7",
          light: "#F8C6DB",
          dark: "#D78DAC",
        },
        lavender: {
          DEFAULT: "#B7A5F7",
          light: "#D4CBFB",
          dark: "#967FF0",
        },
        ivoryWarm: {
          DEFAULT: "#FFF3E8",
          dim: "#E8DED4",
        },
        champagne: {
          DEFAULT: "#E8CDA9",
          soft: "#F4E4CE",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        handwriting: ["var(--font-alex-brush)", "cursive"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
        "rose-glow": "radial-gradient(circle at center, rgba(243, 165, 199, 0.25) 0%, transparent 70%)",
        "lavender-glow": "radial-gradient(circle at center, rgba(183, 165, 247, 0.25) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
