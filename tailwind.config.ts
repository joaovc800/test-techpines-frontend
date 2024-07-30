import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'scale-modal-in': 'scaleModalIn 200ms linear',
      },
      keyframes: {
        scaleModalIn: {
          from : { 
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)"
          },
          to: {
            opacity: "1",
            transform: "translate(-50%, -50%) scale(1)"
          }
        }
      }
    },
  },
  plugins: [],
};
export default config;
