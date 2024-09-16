const { deriveBitsFromPassword } = require("../deriveKeyFromPassword");
const AES = require('./aes');


(async () => {
    const secretKeyString = "nabielrahasiabanget";
    const aesKeyLengthInBytes = 32;
    const keyInBits = await deriveBitsFromPassword(secretKeyString, aesKeyLengthInBytes);

    // iv should in 16 bytes
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const plainTextToEncrypt = "hi, i am very secret";
    const plainTextToEncryptInBytes = AES.utils.utf8.toBytes(plainTextToEncrypt);
    const plainTextPadded = AES.padding.pkcs7.pad(plainTextToEncryptInBytes);


    const aesCbc = new AES.CBC(keyInBits, iv);
    const encrypted = aesCbc.encrypt(plainTextPadded)
    const encryptedString = AES.utils.utf8.fromBytes(encrypted);

    console.log("encryptedString: ", encryptedString)

    const decryption = new AES.CBC(keyInBits, iv);
    const decrypted = decryption.decrypt(encrypted);
    const decryptedString = AES.padding.pkcs7.strip(decrypted);
    console.log("decryptedString: ", decryptedString)

})()