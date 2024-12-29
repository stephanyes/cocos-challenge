module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', "**/__tests__/**"],
  rules: {
    '@typescript-eslint/no-empty-object-type': "off",
    "@typescript-eslint/ban-ts-comment": "off",
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    '@typescript-eslint/no-empty-object-type': "off",
    '@typescript-eslint/no-array-constructor': "off",
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': "off",
    "@typescript-eslint/no-misused-new": "off",
    '@typescript-eslint/no-namespace': "off",
    "@typescript-eslint/no-require-imports": "off"
  },
};
