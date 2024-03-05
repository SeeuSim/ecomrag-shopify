import type { Config } from 'tailwindcss';

const config = {
  content: ["./frontend/**/*.{html,ts,tsx}", "./*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

export default config;
