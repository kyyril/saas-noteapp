import crypto from "crypto";

// Ensure a 32-byte key for AES-256-GCM
function getEncryptionKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) {
    return Buffer.from(envKey, "hex");
  }
  // Safe deterministic fallback derived from app secret if ENCRYPTION_KEY not set
  const secret = process.env.KINDE_CLIENT_SECRET || "saas-noteapp-secure-fallback-salt-2024";
  return crypto.scryptSync(secret, "saas-noteapp-salt", 32);
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for GCM
const PREFIX = "enc:v1:";

/**
 * Encrypts a plain text string using AES-256-GCM
 * Output format: enc:v1:<iv_hex>:<authTag_hex>:<cipher_hex>
 */
export function encrypt(text: string): string {
  if (!text) return text;
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${PREFIX}${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted string.
 * Gracefully handles legacy unencrypted text for backward compatibility.
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;

  // If not encrypted with our prefix, return as-is (backward compatibility)
  if (!encryptedText.startsWith(PREFIX)) {
    return encryptedText;
  }

  try {
    const parts = encryptedText.slice(PREFIX.length).split(":");
    if (parts.length !== 3) {
      return encryptedText;
    }

    const [ivHex, authTagHex, cipherHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt text:", error);
    return "[Decryption Error: Content Tampered or Key Mismatch]";
  }
}
