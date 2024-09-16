import { useCallback, useMemo } from "react";
import { useCryptoContext } from "../context/CryptoContext";
import {
  decryptConversation,
  encryptConversation,
} from "../libs/conversation/utils";
import {
  deriveSharedSecret,
  deserializeECDHPublicKey,
} from "../libs/crypto/ecdh";
import {
  arrayBufferToHexist,
  generateRandomIV,
  hexistsToArrayBuffer,
} from "../libs/crypto/util";
type encryptMessageReturn = {
  messageEncryptedHexist: string;
  ivHexist: string;
};

const useCrypto = (recvPubKey: string) => {
  const receiverPublicKey = useMemo(
    () => deserializeECDHPublicKey(recvPubKey),
    [recvPubKey]
  );

  const { loggedInUserKey } = useCryptoContext();

  const encryptMessageForSending = useCallback(
    (message: string): encryptMessageReturn => {
      const iv = generateRandomIV(16);
      const sharedSecret = deriveSharedSecret(
        loggedInUserKey.privateKey,
        receiverPublicKey
      );
      const messageEncrypted = encryptConversation(
        message,
        new Uint8Array(sharedSecret),
        new Uint8Array(iv)
      );

      return {
        messageEncryptedHexist: arrayBufferToHexist(messageEncrypted),
        ivHexist: arrayBufferToHexist(iv),
      };
    },
    [loggedInUserKey, receiverPublicKey]
  );

  const decryptMessage = useCallback(
    (messageEncryptedHexist: string, ivHexist: string) => {
      const iv = hexistsToArrayBuffer(ivHexist);
      const sharedSecret = deriveSharedSecret(
        loggedInUserKey.privateKey,
        receiverPublicKey
      );
      const message = hexistsToArrayBuffer(messageEncryptedHexist);
      const messageDecrypted = decryptConversation(
        new Uint8Array(message),
        new Uint8Array(sharedSecret),
        new Uint8Array(iv)
      );

      return messageDecrypted;
    },
    [receiverPublicKey, loggedInUserKey]
  );

  return {
    encryptMessageForSending,
    decryptMessage,
  };
};

export default useCrypto;
