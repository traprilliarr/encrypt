declare module "ecdh" {
  interface Curve {}

  interface Keys {
    privateKey: PrivateKey;
    publicKey: PublicKey;
  }

  class PrivateKey {
    static fromBuffer(curve: Curve, buffer: Buffer): PrivateKey;
    static generate(curve: Curve): PrivateKey;
    derivePublicKey(): PublicKey;
    buffer: Buffer;
  }

  class PublicKey {
    static fromBuffer(curve: Curve, buffer: Buffer): PrivateKey;
    static generate(curve: Curve): PrivateKey;
    derivePublicKey(): PublicKey;
    buffer: Buffer;
  }

  function getCurve(curveName: string): Curve;
  function generateKeys(curve: Curve): Keys;
}

interface User {
  id: string;
  name?: string;
  email: string;
  image: string;
}
