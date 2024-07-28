// src/utils.js

export const formatDateTime = (value) => {
    const date = new Date(value);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return date.toLocaleString('he-IL', options);
  };
  