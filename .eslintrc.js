module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:promise/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:unicorn/recommended',
    ],
    rules: {
        'no-bitwise': 'off',
        'no-restricted-syntax': 'off',
        'func-names': 'off',
        'no-prototype-builtins': 'off',
        'class-methods-use-this': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': [
            'error',
            {
                functions: false,
                classes: true,
                variables: true,
            },
        ],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                overrides: { constructors: 'no-public' },
            },
        ],
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
            },
        ],
        '@typescript-eslint/no-use-before-define': [
            'error',
            {
                functions: false,
                classes: true,
                variables: true,
                typedefs: true,
            },
        ],
        '@typescript-eslint/unbound-method': [
            'error',
            {
                ignoreStatic: true,
            },
        ],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['**/*.test.ts', '**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.po.ts'],
            },
        ],
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        'unicorn/no-for-loop': 'error',
        'no-plusplus': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'promise/prefer-await-to-then': 'warn',
        'unicorn/no-for-loop': 'off',
    },
};
