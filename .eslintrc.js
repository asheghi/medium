module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    // 'vue/no-unused-vars': 'error'
    'import/prefer-default-export': 0,
  },
  settings: {
    'import/core-modules': [
      '@vitejs/plugin-vue',
      'vike/abort',
      'vike/plugin',
      'vike/server',
      'vike-vue/config',
      'vike-vue/useData',
      'vike-vue/usePageContext',
      'vite',
    ],
  },
  overrides: [
    {
      files: ['pages/**/+*.vue'],
      rules: {
        'vue/multi-word-component-names': 0,
      },
    },
  ],
};
