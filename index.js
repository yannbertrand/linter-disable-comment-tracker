import { ESLint } from 'eslint';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import noEslintDisableComment from './rules/no-eslint-disable-comment.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('eslint').ESLint} */
const eslint = new ESLint({
  overrideConfigFile: true,
  cwd: pathToFileURL(join(__dirname, '..')).pathname,
  plugins: {
    local: {
      rules: {
        'no-eslint-disable-comment': noEslintDisableComment,
      },
    },
  },
  overrideConfig: {
    rules: {
      'local/no-eslint-disable-comment': 'error',
    },
  },
});

const results = await eslint.lintFiles('linter-disable-comment-tracker/**/*.js');

const formatter = await eslint.loadFormatter('stylish');
const resultText = formatter.format(results);

console.log(resultText);
