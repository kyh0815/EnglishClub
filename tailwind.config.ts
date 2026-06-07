import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFDF8",
        ink: "#1C1A16"
      },
      fontFamily: {
        pretendard: [
          "Pretendard",
          "Pretendard Variable",
          "-apple-system",
          "Apple SD Gothic Neo",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
