export const getRelativeTime = (dateString, short = true) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) return "Just now";

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      if (short) {
        // unambiguous short labels
        const shortMap = {
          year: 'yr',
          month: 'mo',
          day: 'd',
          hour: 'hr',
          minute: 'min',
        };

        return `${count} ${shortMap[unit]} ago`;
      }

      // full readable label with pluralization
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }
  }
};
