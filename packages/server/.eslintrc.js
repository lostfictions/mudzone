module.exports = {
  root: true,
  env: {
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
  extends: ["eslint:recommended", "prettier", "prettier/@typescript-eslint"],
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
    "no-shadow": "warn"
  }
};
