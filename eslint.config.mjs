import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint, { parser } from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactX from 'eslint-plugin-react-x';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import { fixupPluginRules } from '@eslint/compat';
import deprecation from 'eslint-plugin-deprecation';
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = defineConfig(
  globalIgnores([
    'testing/**',
    'scripts/**',
    'packages/*/dist/',
    'packages/*/coverage/',
    'packages/*/vitest.config.ts',
  ]),
  {
    files: ['packages/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'unused-imports': fixupPluginRules(unusedImports),
      'simple-import-sort': fixupPluginRules(simpleImportSortPlugin),
      deprecation: fixupPluginRules(deprecation),
      '@typescript-eslint': tseslint.plugin,
      'react-x': fixupPluginRules(reactX),
      '@stylistic/ts': stylistic,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...tseslint.configs.eslintRecommended.rules,
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      'simple-import-sort/imports': 'error',
      '@stylistic/ts/comma-dangle': ['error', 'always-multiline'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'deprecation/deprecation': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useUpdateEffect)',
        },
      ],
      'react-x/no-forward-ref': 'error',
    },
  },
);

export default eslintConfig;
