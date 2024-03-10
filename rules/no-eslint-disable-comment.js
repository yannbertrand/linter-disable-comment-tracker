const messages = {
  LINE_DISABLED: 'ESLint rule "{{rule}}" is disabled on a line.',
  FILE_DISABLED: 'ESLint rule "{{rule}}" is disabled on a file.',
};

const fileDisableRegex = /^eslint-disable\s+(?<rules>(([@\w,\s\/-]+)))$/;
const lineDisableRegex = /^eslint-disable-(next-line|line)\s+(?<rules>(([@\w,\s\/-]+)))$/;

/** @param {import('eslint').Rule.RuleContext} context */
const create = (context) => ({
  Program(node) {
    for (const comment of node.comments) {
      const value = comment.value.trim();
      const fileDisabled = fileDisableRegex.exec(value);
      const lineDisabled = lineDisableRegex.exec(value);

      if (fileDisabled) {
        const rules = fileDisabled.groups.rules.split(',').map((rule) => rule.trim());

        for (const rule of rules) {
          context.report({
            node,
            messageId: 'FILE_DISABLED',
            data: { rule },
          });
        }
      }

      if (lineDisabled) {
        const rules = lineDisabled.groups.rules.split(',').map((rule) => rule.trim());

        for (const rule of rules) {
          context.report({
            node,
            messageId: 'LINE_DISABLED',
            data: { rule },
          });
        }
      }
    }
  },
});

/** @type {import('eslint').Rule.RuleModule} */
export default {
  create,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent `eslint-disable` comments.',
    },
    messages,
  },
};
