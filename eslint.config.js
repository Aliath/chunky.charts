import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'no-relative-import-paths': noRelativeImportPaths,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^react$', '^react', '^(?!react)', '^\\.', '^@', '.+\\.(s)?css$']],
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/no-unresolved': ['error', { ignore: ['typescript-eslint'] }],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: true,
          rootDir: 'src',
          prefix: '@',
        },
      ],
      'no-console': ['warn'],
      'semi': ['error', 'always'],
      'indent': ['error'],
    },
    settings: {
      // Optional: configure settings for import resolution if necessary
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        typescript: {},
      },
    },
  },
  eslintConfigPrettier
);
