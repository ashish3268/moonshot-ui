import { formatDistanceToNow, isToday, isYesterday, format, parseISO } from 'date-fns';

export function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'today';
  if (isYesterday(date)) return 'yesterday';

  const distance = formatDistanceToNow(date, { addSuffix: false });
  // date-fns returns strings like "3 days", "about 1 month" etc.
  // For recent dates return "N days ago"; for older ones return "MMM d"
  const dayMatch = distance.match(/^(\d+)\s+day/);
  if (dayMatch) {
    return `${dayMatch[1]} days ago`;
  }

  return format(date, 'MMM d');
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

interface HasCreatedAt {
  createdAt: string;
}

export function groupByDate<T extends HasCreatedAt>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = formatDisplayDate(item.createdAt);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}
