import { ESLint } from 'eslint';
import noEslintDisableComment from './rules/no-eslint-disable-comment.js';

const testCode = `
/* eslint-disable no-lonely-if*/
  const name = "eslint"; // eslint-disable-line no-unused-vars
  if(true) {
    console.log("constant condition warning")
  };
`;

const eslint = new ESLint({
  overrideConfigFile: true,
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

const results = await eslint.lintText(testCode);

const formatter = await eslint.loadFormatter('stylish');
const resultText = formatter.format(results);

console.log(resultText);
