export const formatJoinDate = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};
