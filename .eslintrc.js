module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_|next" }],
    "no-console": "off",
    semi: ["error", "always"],
    quotes: ["error", "single", { allowTemplateLiterals: true }],
    indent: ["error", 2, { SwitchCase: 1 }],
    "comma-dangle": ["error", "always-multiline"],
    "no-var": "error",
    "prefer-const": "error",
    eqeqeq: ["error", "always"],
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
  },
};
