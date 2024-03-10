import outdent from 'outdent';
import test from 'ava';
import AvaRuleTester from 'eslint-ava-rule-tester';
import rule from './no-eslint-disable-comment.js';

const ruleTester = new AvaRuleTester(test, {
  plugins: {
    plugin: {
      rules: {
        rule: {},
      },
    },
    '@scope': {
      rules: {
        'rule-name': {},
      },
    },
    '@scope/plugin': {
      rules: {
        'rule-name': {},
      },
    },
  },
});

ruleTester.run('no-eslint-disable-comment', rule, {
  valid: ['eval();', 'eval(); // some comment', 'eval(); // eslint-line-disable'],

  invalid: [
    {
      code: 'eval(); // eslint-disable-line no-eval',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } }],
    },
    {
      code: 'eval(); // eslint-disable-line no-eval, no-console',
      errors: [
        { messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } },
        { messageId: 'LINE_DISABLED', data: { rule: 'no-console' } },
      ],
    },
    {
      code: 'eval(); //eslint-disable-line no-eval',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } }],
    },
    {
      code: 'eval(); //     eslint-disable-line no-eval',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } }],
    },
    {
      code: 'eval(); //\teslint-disable-line no-eval',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } }],
    },
    {
      code: 'eval(); /* eslint-disable-line no-eval */',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } }],
    },
    {
      code: 'eval(); // eslint-disable-line plugin/rule',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: 'plugin/rule' } }],
    },
    {
      code: 'eval(); // eslint-disable-line @scope/plugin/rule-name',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: '@scope/plugin/rule-name' } }],
    },
    {
      code: 'eval(); // eslint-disable-line no-eval, @scope/plugin/rule-name',
      errors: [
        { messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } },
        { messageId: 'LINE_DISABLED', data: { rule: '@scope/plugin/rule-name' } },
      ],
    },
    {
      code: 'eval(); // eslint-disable-line @scope/rule-name',
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: '@scope/rule-name' } }],
    },
    {
      code: 'eval(); // eslint-disable-line no-eval, @scope/rule-name',
      errors: [
        { messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } },
        { messageId: 'LINE_DISABLED', data: { rule: '@scope/rule-name' } },
      ],
    },
    { code: '/* eslint-disable no-eval */', errors: [{ messageId: 'FILE_DISABLED', data: { rule: 'no-eval' } }] },
    {
      code: outdent`
              /* eslint-disable @scope/rule-name */
              eval(); // eslint-disable-line no-eval
          `,
      errors: [
        { messageId: 'FILE_DISABLED', data: { rule: '@scope/rule-name' } },
        { messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } },
      ],
    },
    {
      code: outdent`
            foo();
            // eslint-disable-line no-eval
            eval();
        `,
      errors: [{ messageId: 'LINE_DISABLED', data: { rule: 'no-eval' } }],
    },
    {
      code: outdent`
            foo();
            /* eslint-disable no-eval */
            eval();
        `,
      errors: [{ messageId: 'FILE_DISABLED', data: { rule: 'no-eval' } }],
    },
    {
      code: outdent`
          foo();
          /* eslint-disable-next-line no-eval */
          eval();
        `,
      errors: [{ messageId: 'LINE_DISABLED' }],
    },
  ],
});
