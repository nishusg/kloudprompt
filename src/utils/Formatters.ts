export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};