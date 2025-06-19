export default {
  transform: {
    "^.+\\.(js|jsx|mjs)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  }
};
