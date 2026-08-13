export function isKhmer(text: string): boolean {
  return /[\u1780-\u17FF]/.test(text);
}
