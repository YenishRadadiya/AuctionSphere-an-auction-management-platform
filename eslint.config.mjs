// import { defineConfig } from "eslint/config";
// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";


// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
//   { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
//   tseslint.configs.recommended,
// ]);

import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    // JS/TS base config for both client and server
    {
        files: ["**/*.{js,cjs,mjs,ts,cts,mts}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: { ...globals.browser, ...globals.node },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            // Optional: Add or override rules here
        },
        extends: [
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
            "plugin:@typescript-eslint/stylistic",
        ],
    },

    // Type-aware config for client folder
    {
        files: ["client/**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                project: "./client/tsconfig.json",
            },
        },
    },

    // Type-aware config for server folder
    {
        files: ["server/**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                project: "./server/tsconfig.json",
            },
        },
    },
]);
