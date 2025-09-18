// دوال مساعدة بسيطة بدون اعتماد على مكتبات خارجية
export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
