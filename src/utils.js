const crypto = require('crypto');

function generateSeed(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1)
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
        }
    }
    return seed;
}
const security = 2;
const globalProvider = "http://bare01.devnet.iota.cafe:14265";
const mode = "restricted";

module.exports = {
    generateSeed,
    security,
    globalProvider,
    mode
};