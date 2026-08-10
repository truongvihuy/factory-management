import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.yarn/**',
      '**/.pnp.*',
      '**/*.min.js',
      '**/generated/**',
      '.idea/**',
    ],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    rules: {
      /*
       * ========================================
       * TypeScript
       * ========================================
       */

      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      /*
       * ========================================
       * General JavaScript
       * ========================================
       */

      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],

      /*
       * ========================================
       * Code Safety
       * ========================================
       */

      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-await': 'error',

      /*
       * ========================================
       * NestJS / Backend
       * ========================================
       *
       * Keep framework-specific restrictions
       * minimal at this foundation stage.
       */

      'class-methods-use-this': 'off',
    },
  },

  /*
   * ========================================
   * JavaScript Configuration Files
   * ========================================
   */

  {
    files: ['**/*.config.js', '**/*.config.mjs', '**/eslint.config.mjs'],

    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  /*
   * ========================================
   * Prettier
   * ========================================
   *
   * Must be last so that ESLint formatting
   * rules do not conflict with Prettier.
   */

  prettier,
);
