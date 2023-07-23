import {formatDuration, intervalToDuration} from 'date-fns';
import ruLocale from 'date-fns/locale/ru'; // Import the Russian locale

export const millisToInterval = (milliseconds) => {
  // Use intervalToDuration to convert milliseconds to a duration object
  const duration = intervalToDuration({ start: 0, end: milliseconds });

  // Format the duration using the formatDuration function from date-fns
    return formatDuration(duration, {format: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'], locale: ruLocale});
};
