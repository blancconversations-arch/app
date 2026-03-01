/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks", "react-refresh"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};
