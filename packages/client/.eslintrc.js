module.exports = {
  extends: [
    // eslint's `extends` can be a bit confusing -- it's tempting to declare all
    // necessary rule extensions again here, but extending `eslint:recommended`
    // again (since it's already extended in the root file) will *re-override*
    // our overrides defined in the root file. on the other hand, `prettier`
    // (and `prettier/@typescript-eslint`) need to go at the *end* of the
    // extends chain, so we *do* re-declare them a second time here. (we keep
    // them in the base file so nothing will break if we want to use the latter
    // as a standalone config.)
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  env: {
    browser: true
  },
  parserOptions: {
    // This seemed like the least contrived way to point `@typescript-eslint` to
    // the correct nested config file -- it was searching for one in the cwd
    // instead.
    project: `${__dirname}/tsconfig.json`
  },
  settings: { react: { version: "detect" } },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
