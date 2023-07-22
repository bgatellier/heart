module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },
  ignorePatterns: ["bin/"],
  plugins: ["@typescript-eslint"],
  extends: [
    /**
     * @see {@link https://eslint.org/docs/latest/rules/ }
     */
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
}
