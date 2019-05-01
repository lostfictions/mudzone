module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    }
  },
  settings: { react: { version: "detect" } },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  rules: {
    curly: ["warn", "multi-line", "consistent"],
    "no-console": "off",
    "no-dupe-class-members": "error",
    "no-empty": "warn",
    "no-undef": "error",
    "no-unused-expressions": "error",
    "no-unused-vars": "off",
    "no-var": "warn",
    "prefer-const": "warn",
    "no-shadow": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "none",
        ignoreRestSiblings: true
      }
    ]
  }
};
