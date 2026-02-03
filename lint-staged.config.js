/**  @type {import('lint-staged').Config} */
export default {
  "*.{js,jsx,ts,tsx,vue}": [
    "prettier --write",
    "oxlint --fix",
    "eslint --fix"
  ],
  "!(package)*.json": [
    "prettier --write --parser json"
  ],
  "package.json": [
    "prettier --write"
  ],
  "*.{scss,less,styl,html}": [
    "stylelint --fix --allow-empty-input",
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
};
