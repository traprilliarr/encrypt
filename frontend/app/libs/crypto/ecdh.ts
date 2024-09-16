
import ecdh from 'ecdh';
const ecdhCurveString = 'secp256r1';
import crypto from 'crypto';

const generateEcdhKeyPair = (): any => {
    return ecdh.generateKeys(ecdh.getCurve(ecdhCurveString));
}

export const encryptEcdhPrivateKey = async (aesCBCSecretKey: CryptoKey, iv: Uint8Array, message: ArrayBuffer) => {
    return window.crypto.subtle.encrypt({
        name: 'AES-CBC',
        iv,
    }, aesCBCSecretKey, message)
}

export const decryptEcdhPrivateKey = async (aesCBCSecretKey: CryptoKey, iv: Uint8Array, message: ArrayBuffer) => {
    return crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv,
    }, aesCBCSecretKey, message)
}

export const serializeECDHKey = (key: any) => {
    return key.buffer.toString('hex');
}

export const deserializeECDHPublicKey = (pubKey: string) => {
    return ecdh.PublicKey.fromBuffer(ecdh.getCurve(ecdhCurveString), Buffer.from(pubKey, 'hex'));
}

export const deserializeECDHPrivateKey = (privKey: string) => {
    return ecdh.PrivateKey.fromBuffer(ecdh.getCurve(ecdhCurveString), Buffer.from(privKey, 'hex'));
}

export const deriveSharedSecret = (privateKey: any, publicKey: any): ArrayBuffer => {
    return privateKey.deriveSharedSecret(publicKey);
}

export default generateEcdhKeyPair;