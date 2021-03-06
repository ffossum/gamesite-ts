module.exports = {
  setupTestFrameworkScriptFile: "<rootDir>/jest.setup.js",
  transform: {
    "^.+\\.(jsx?|tsx?)$": "babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx,json}"],
};
