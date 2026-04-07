export function sanitizeString(value: string): string {
  // remove leading/trailing white space and protect against simple XSS snippets
  let sanitized = value.trim();
  sanitized = sanitized.replace(/<\/?script[^>]*>/gi, '');
  sanitized = sanitized.replace(/\s+/g, ' ');
  return sanitized;
}

export function sanitizePhone(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

export function sanitizeNumber(value: string): number | null {
  const parsed = parseFloat(value.toString().replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

export function validateUsername(value: string): boolean {
  const sanitized = sanitizeString(value);
  return /^[a-zA-Z0-9_]{3,20}$/.test(sanitized);
}

export function validatePassword(value: string): boolean {
  const sanitized = sanitizeString(value);
  return sanitized.length >= 6;
}

export function validatePhoneNumber(value: string): boolean {
  const cleaned = sanitizePhone(value);
  return /^\d{10,15}$/.test(cleaned);
}
