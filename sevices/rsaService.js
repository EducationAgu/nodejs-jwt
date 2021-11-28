const NodeRSA = require("node-rsa");

class RsaService {
    constructor() {
        this.key = new NodeRSA({b: 1024});
        this.publicKey = this.key.exportKey('public');

    }
    /**
     * шифрует данные перед отправкой
     *
     * @param data {string|number|object|array|Buffer} - data for encrypting. Object and array will convert to JSON string.
     * @returns {string|Buffer}
     */
    encrypt(data) {
        return this.key.encrypt(data, 'base64')
    }

    /**
     * расшифровывает данные при получении
     *
     * @param data {string|number|object|array|Buffer} - data for encrypting. Object and array will convert to JSON string.
     * @returns {string|Buffer}
     */
    decrypt(data) {
        return this.key.decrypt(data)
    }

    getPublicKey() {
        return this.publicKey;
    }

}
module.exports = new RsaService();

