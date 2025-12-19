// Cypress E2E Support File
// This file is processed and loaded automatically before your test files.

// Import commands.js if you have custom commands
// import './commands'

// Hide fetch/XHR requests from command log (optional)
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}
