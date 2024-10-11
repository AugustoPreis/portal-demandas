import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class Crypt {
  static hash(value: string) {
    return bcrypt.hashSync(value, 10);
  }

  static encrypt(decrypted: string) {
    const iv = Crypt.random(8);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      process.env.AES_256_CBC_KEY,
      iv,
    );

    const encrypted = cipher
      .update(decrypted, 'utf8', 'hex')
      .concat(cipher.final('hex'));

    return { encrypted, decrypted, iv };
  }

  static decrypt(encrypted: string, iv: string) {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      process.env.AES_256_CBC_KEY,
      iv,
    );

    return decipher
      .update(encrypted, 'hex', 'utf8')
      .concat(decipher.final('utf8'));
  }

  static compare(decrypted: string, encrypted: string) {
    return bcrypt.compareSync(decrypted, encrypted);
  }

  static random(length = 10): string {
    return crypto.randomBytes(length).toString('hex');
  }
}