export default {
  bail: false,
  moduleFileExtensions: ["js", "svelte"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": "svelte-jester",
  },
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".svelte"],
  verbose: true,
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid/wrapper.mjs",
  },
};
