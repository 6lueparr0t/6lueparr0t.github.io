// lib/date.ts

function pad(num: number): string {
  return String(num).padStart(2, "0");
}

export function formatDate(date: Date, format = "yyyy-MM-dd HH:mm:ss", timeZone?: string): string {
  let localDate = new Date(date);

  if (timeZone === "Asia/Seoul") {
    localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  }

  const tokens: Record<string, string> = {
    YYYY: localDate.getFullYear().toString(),
    yyyy: localDate.getFullYear().toString(),
    MM: pad(localDate.getMonth() + 1),
    DD: pad(localDate.getDate()),
    HH: pad(localDate.getHours()),
    mm: pad(localDate.getMinutes()),
    ss: pad(localDate.getSeconds()),
  };

  return Object.entries(tokens).reduce((acc, [key, val]) => acc.replace(key, val), format);
}

export function diffInYears(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  return parseFloat((diff / msPerYear).toFixed(2));
}

export function parseDate(input: string): Date | null {
  const dateTimeRegex = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/;
  const match = input.match(dateTimeRegex);
  if (!match) return null;

  const [_, year, month, day, hour, minute] = match.map(Number);
  const parsed = new Date(year, month - 1, day, hour, minute);
  return isNaN(parsed.getTime()) ? null : parsed;
}
