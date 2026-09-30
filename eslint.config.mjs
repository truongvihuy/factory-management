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

      '@typescript-eslint/consistent-type-imports': 'off',

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

  /*
   * ========================================
   * Imports
   * ========================================
   *
   */
  {
    files: ['apps/*/src/**/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**', '**/infrastructure/**', '**/presentation/**', '**/apps/**'],
              message: 'Domain layer must not depend on Application, Infrastructure, or Presentation layers.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['apps/*/src/**/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '**/presentation/**', '**/apps/**'],
              message: 'Application layer must depend on port/contracts, not Infrastructure, or Presentation layers.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['apps/*/src/**/infrastructure/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/presentation/**'],
              message: 'Infrastructure layer must not depend on Presentation layers.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['libs/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../apps/**', '../apps/**', '@apps/**', 'apps/**'],
              message: 'Shared libraries must not depend on application code.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['apps/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../apps/**', '../../../apps/**', '@apps/**'],
              message:
                'Services must not import source code from another service. Use gRPC contracts or events instead.',
            },
            {
              group: [
                '@fms/common/*',
                '@fms/config/*',
                '@fms/events/*',
                '@fms/grpc/*',
                '@fms/logger/*',
                '@fms/observability/*',
              ],
              message:
                'Import shared libraries through their public package entrypoint. Deep imports are forbidden.',
            },
            {
              group: [
                '../../../libs/*',
                '../../libs/*',
                '../libs/*',
              ],
              message:
                'Do not import libraries through relative paths. Use the package public API.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['libs/common/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          path: [
            {
              name: '@nestjs/common',
              message: 'Use @nestjs/common only in the application layer, not in shared libraries.',
            },
            {
              name: '@nestjs/core',
              message: 'Use @nestjs/core only in the application layer, not in shared libraries.',
            },
            {
              name: 'express',
              message: 'Use express only in the application layer, not in shared libraries.',
            },
          ],
        },
      ],
    },
  },
);
