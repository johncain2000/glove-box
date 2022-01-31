// https://gist.github.com/redgeoff/12cdf5b0043c3617ca54cbde3fbb8f7b
// Encode/decode a password in JS in a way that is compatible with Python's werkzeug password hashing
const crypto = require('crypto');
const util = require('util')

const pbkdf2 = util.promisify(crypto.pbkdf2)

// Roughly compatible with Python's generate_password_hash (https://werkzeug.palletsprojects.com/en/1.0.x/utils/#werkzeug.security.generate_password_hash)
const generatePasswordHash = async (password) => {
  try {
    const saltLength = 16; // Translates to a length of 32 when hex encoded
    const salt = crypto.randomBytes(saltLength).toString('hex');
    const iterations = 50000;
    const keylen = 32; // Translates to a length of 64 when hex encoded
    const digest = 'sha256'
    const hash = await pbkdf2(password, salt, iterations, keylen, digest);
    const encodedHash = hash.toString('hex');
    return `pbkdf2:${digest}:${iterations}$${salt}$${encodedHash}`
  } catch (e) {
    return false;
  }
}
exports.generatePasswordHash = generatePasswordHash;

// Roughly compatible with Python's check_password_hash (https://werkzeug.palletsprojects.com/en/1.0.x/utils/#werkzeug.security.check_password_hash)
const checkPasswordHash = async (hashedPassword, clearTextPassword) => {
  try {
    const pieces = hashedPassword.split(/:|\$/);
    const digest = pieces[1];
    const iterations = parseInt(pieces[2]);
    const salt = pieces[3];
    const hash = pieces[4];
    const decodedHash = Buffer.from(hash, 'hex');
    const keylen = decodedHash.length;
    const hashedClearTextPassword = await pbkdf2(clearTextPassword, salt, iterations, keylen, digest);
    const encodedClearTextPassword = hashedClearTextPassword.toString('hex');
    return encodedClearTextPassword === hash;
  } catch (e) {
    return false;
  }
}
exports.checkPasswordHash = checkPasswordHash;
