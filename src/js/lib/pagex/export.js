// Export it for webpack
require('./hashchange');
var pagex = require('./pagex');
if (typeof module === 'object' && module.exports) {
  module.exports = { pagex: pagex };
}
