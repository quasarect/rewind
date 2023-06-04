/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	collectCoverageFrom: ["!**/node_modules/**", "<rootDir>/server/**/*.ts"],

	// The directory where Jest should output its coverage files
	coverageDirectory: "./server/coverage",

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: ["/node_modules/"],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: "v8",

	// A preset that is used as a base for Jest's configuration
	preset: "ts-jest",

	// The test environment that will be used for testing
	testEnvironment: "node",

	// The glob patterns Jest uses to detect test files
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[tj]s?(x)",
	],
};
