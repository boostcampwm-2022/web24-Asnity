export const formatDate = (str: string) =>
  new Date(str).toLocaleDateString('ko', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
