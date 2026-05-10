import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        parchment: '#e8dcc0',
        ink: '#1c1410',
        gold: {
          DEFAULT: '#d4a24f',
          dim: '#a87234',
        },
        oxblood: '#7a1a1a',
      },
    },
  },
  plugins: [],
};

export default config;
