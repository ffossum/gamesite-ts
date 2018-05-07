module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(jsx?|tsx?)$": "babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*"],
};
