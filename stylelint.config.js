const bem = '[a-z0-9]+(-[a-z0-9]+)*';
const itcssClass = `^(o|c|u)-${bem}(__${bem})?(--${bem})?$`;

export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'media-feature-range-notation': 'prefix',
    'no-descending-specificity': null,
    'selector-max-id': 0,
    'declaration-no-important': true,
    'max-nesting-depth': 3,
    'selector-class-pattern': [itcssClass, { resolveNestedSelectors: true }],
  },
  overrides: [
    {
      files: ['src/styles/5-objects/**/*.scss', 'src/styles/6-components/**/*.scss'],
      rules: { 'selector-max-type': 0 },
    },
    {
      files: ['src/styles/7-utilities/**/*.scss'],
      rules: { 'declaration-no-important': null },
    },
  ],
};
