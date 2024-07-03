const crypto = require('crypto');

// Function to generate a salt
const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Function to hash a password with a salt
const hashPassword = (password, salt) => {
    return crypto.createHmac('sha256', salt)
                 .update(password)
                 .digest('hex');
};

// Function to compare a password with its hash
const comparePassword = (password, salt, hash) => {
    return hashPassword(password, salt) === hash;
};

module.exports = { generateSalt, hashPassword, comparePassword };
