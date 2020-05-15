module.exports = {
  files: [
    'vaadin-text-field.js',
    'vaadin-text-area.js',
    'vaadin-password-field.js',
    'vaadin-number-field.js',
    'vaadin-email-field.js',
    'vaadin-integer-field.js'
  ],
  from: [
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
