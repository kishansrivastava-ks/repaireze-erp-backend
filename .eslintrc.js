module.exports = {
  env: { node: true, es6: true },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: { ecmaVersion: 2020, sourceType: "module" },
  rules: { "no-console": "off" },
};
