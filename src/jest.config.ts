import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest", // Use ts-jest to handle TypeScript
  testEnvironment: "node", // Node environment (or 'jsdom' for browser-like)
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"], // Match test files
};

export default config;
