export default {
  '*.{js,jsx,ts,tsx,mjs,cjs,json,md,html,yml,yaml,css,scss,sass}': [
    'prettier --write --ignore-unknown',
  ],
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['eslint --fix --max-warnings=0 --no-warn-ignored'],
  '*.{css,scss,sass}': ['stylelint --fix --max-warnings=0'],
}
