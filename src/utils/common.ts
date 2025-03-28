import { v4 as uuidv4 } from 'uuid';

export function formatDate(date: Date): string {
  const yy = date.getFullYear().toString().slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

export function generateShortUuid(): string {
  return uuidv4().replace(/-/g, '').substr(0, 8).toUpperCase();
}

export function formatMoney(value: number): string {
  const formattedValue = value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return formattedValue.replace('₫', '').trim();
}
