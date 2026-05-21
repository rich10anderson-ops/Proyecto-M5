/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#050508",
          dark: "#0b0c10",
          card: "#12131a",
          gray: "#1f212d",
          light: "#c5c6c7",
          cyan: "#00f0ff",
          pink: "#ff007f",
          lime: "#39ff14",
          violet: "#8b5cf6",
          yellow: "#ffe600",
        }
      },
      fontFamily: {
        cyber: ["Space Grotesk", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 8px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.2)",
        "neon-pink": "0 0 8px rgba(255, 0, 127, 0.5), 0 0 20px rgba(255, 0, 127, 0.2)",
        "neon-lime": "0 0 8px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.2)",
        "neon-violet": "0 0 8px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)",
        "neon-cyan-intense": "0 0 15px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.4)",
        "neon-pink-intense": "0 0 15px rgba(255, 0, 127, 0.8), 0 0 30px rgba(255, 0, 127, 0.4)",
        "neon-lime-intense": "0 0 15px rgba(57, 255, 20, 0.8), 0 0 30px rgba(57, 255, 20, 0.4)",
      },
      animation: {
        "pulse-cyan": "pulse-cyan 2s infinite",
        "pulse-pink": "pulse-pink 2s infinite",
        "pulse-lime": "pulse-lime 2s infinite",
        "glitch": "glitch 1s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-cyan": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 240, 255, 0.5), 0 0 15px rgba(0, 240, 255, 0.2)" },
          "50%": { boxShadow: "0 0 18px rgba(0, 240, 255, 0.8), 0 0 35px rgba(0, 240, 255, 0.4)" }
        },
        "pulse-pink": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(255, 0, 127, 0.5), 0 0 15px rgba(255, 0, 127, 0.2)" },
          "50%": { boxShadow: "0 0 18px rgba(255, 0, 127, 0.8), 0 0 35px rgba(255, 0, 127, 0.4)" }
        },
        "pulse-lime": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(57, 255, 20, 0.5), 0 0 15px rgba(57, 255, 20, 0.2)" },
          "50%": { boxShadow: "0 0 18px rgba(57, 255, 20, 0.8), 0 0 35px rgba(57, 255, 20, 0.4)" }
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" }
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" }
        }
      }
    },
  },
  plugins: [],
}

