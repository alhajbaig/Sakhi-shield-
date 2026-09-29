// SakhiShield — Evidence Cryptographic Integrity Hashing
// Computes genuine SHA-256 digests over file bytes using Web Crypto API.

/**
 * Computes SHA-256 hex digest from File or ArrayBuffer.
 * Returns lowercase hex string prefixed with '0x'.
 */
export async function computeFileSha256(fileOrBuffer: File | ArrayBuffer): Promise<string> {
  let buffer: ArrayBuffer;

  if (fileOrBuffer instanceof File) {
    buffer = await fileOrBuffer.arrayBuffer();
  } else {
    buffer = fileOrBuffer;
  }

  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return `0x${hex}`;
  }

  throw new Error('Web Cryptography API (crypto.subtle) is required for SHA-256 verification.');
}

/**
 * Verifies whether provided file content matches the stored digest
 */
export async function verifyEvidenceIntegrity(
  fileOrBuffer: File | ArrayBuffer,
  expectedHash: string
): Promise<boolean> {
  if (!expectedHash) return false;
  try {
    const calculated = await computeFileSha256(fileOrBuffer);
    return calculated.toLowerCase() === expectedHash.toLowerCase();
  } catch {
    return false;
  }
}
