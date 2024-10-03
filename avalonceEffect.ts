// script ini bertujuan untuk menghitung avalonce effect
// cara kerjanya adalah membandingkan plain text dan encrypted text

import {
  generateIv, deriveBitsFromPassword,
  AES, stringToBytesWithPaddingAndUT8Encode
} from "./frontend/test"

const blueText = (m: string) => `\x1b[36m${m}\x1b[0m`

function stringToHex(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hex = Array.from(data, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return hex;
}

const hexToBinary = (hex: string) => parseInt(hex, 16).toString(2)


const AvalonceEffect = (plainTextHex: string, chiperTextHex: string) => {
  const plaintextBinary = hexToBinary(plainTextHex)
  const ciphertextBinary = hexToBinary(chiperTextHex)

  const trimmedCiphertext = ciphertextBinary.substring(0, ciphertextBinary.length - 0);
  
  let differentBits = 0;
  for (let i = 0; i < plaintextBinary.length; i++) {
    if (plaintextBinary[i] !== trimmedCiphertext[i]) {
      differentBits++;
    }
  }

  let percentage = (differentBits / plaintextBinary.length) * 100;
  return percentage.toFixed(2);
}

const encrypted = async (aesCbc: any, message: string) => {
  const encrypted = aesCbc.encrypt(stringToBytesWithPaddingAndUT8Encode(message))
  return stringToHex(AES.utils.utf8.fromBytes(encrypted))
}

async function avalonceEffect(message: string) {
  const iv = generateIv()
  const keyInBits = await deriveBitsFromPassword("secretkey", 32)
  const aesCbc = new AES.CBC(new Uint8Array(keyInBits.derivedBits), iv)
  const encryptedText = await encrypted(aesCbc, message)
  const plainTextHex = stringToHex(message)

  console.log(`${blueText('Avalonce Effect')}
text            : ${message}
plainTextHex    : ${plainTextHex}
encryptedText   : ${encryptedText}
length text     : ${message.length}
avalonce effect : ${AvalonceEffect(plainTextHex, encryptedText)}%
    `)
}

avalonceEffect("nursyah")
