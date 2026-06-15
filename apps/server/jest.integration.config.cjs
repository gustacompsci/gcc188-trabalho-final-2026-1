/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ["js", "mjs", "json", "ts"],
  rootDir: ".",
  testRegex: "src/.*\\.integration\\.spec\\.ts$",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          moduleResolution: "node",
          resolvePackageJsonExports: false,
          allowJs: true,
        },
      },
    ],
    "^.+\\.mjs$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          moduleResolution: "node",
          resolvePackageJsonExports: false,
          allowJs: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@extraufla/shared$": "<rootDir>/../../packages/shared/src/index.ts",
    "^resend$": "<rootDir>/src/test/__mocks__/resend.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFiles: ["<rootDir>/src/test/setup.ts"],
  testEnvironment: "node",
};
