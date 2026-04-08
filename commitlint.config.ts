import type { UserConfig } from '@commitlint/types'

const LEVEL_ERROR = 2
const LEVEL_WARNING = 1
const LEVEL_OFF = 0
const HEADER_MAX_LENGTH = 200

const configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(commit) => commit.includes('init')],
  rules: {
    'body-leading-blank': [LEVEL_ERROR, 'always'],
    'footer-leading-blank': [LEVEL_WARNING, 'always'],
    'header-max-length': [LEVEL_ERROR, 'always', HEADER_MAX_LENGTH],
    'subject-case': [LEVEL_OFF],
    'subject-empty': [LEVEL_ERROR, 'never'],
    'type-empty': [LEVEL_ERROR, 'never'],
    'type-enum': [
      LEVEL_ERROR,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'release',
        'revert',
        'style',
        'test',
        'types',
        'wip',
        'workflow',
      ],
    ],
  },
}

export default configuration
