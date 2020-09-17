const JDLSecure = require('../../core/jdl_secure');

module.exports = { convertSecure };

function convertSecure(secure) {
  if (!secure) {
    throw new Error('A secure definition has to be passed so as to be converted.');
  }
  return new JDLSecure(secure);
}
