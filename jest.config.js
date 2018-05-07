module.exports = {
  setupFiles: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(jsx?|tsx?)$": "babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx,json}"],
};
