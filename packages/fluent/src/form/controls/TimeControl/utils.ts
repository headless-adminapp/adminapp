import dayjs from 'dayjs';

const STANDARD_TIME_REGEX = /^(\d{1,2}):?(\d{2})?([ap]m)?$/i;

export function resolveTimeValue(
  value: string,
  timeFormat: string
): Date | undefined {
  if (!value) {
    return;
  }

  // Check if the value matches the standard time format (H, HH, H:MM, HH:MM, H:MM AM/PM, HH:MM AM/PM)

  const standardTimeMatch = STANDARD_TIME_REGEX.exec(value);

  if (standardTimeMatch) {
    const hour = Number(standardTimeMatch[1]);
    const minute = standardTimeMatch[2] ? Number(standardTimeMatch[2]) : 0;
    const isPM = standardTimeMatch[3]
      ? standardTimeMatch[3].toLowerCase().startsWith('p')
      : false;

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return;
    }

    let adjustedHour = hour;
    if (isPM && hour < 12) {
      adjustedHour += 12; // Convert PM hour to 24-hour format
    }

    if (!isPM && standardTimeMatch[3] && hour === 12) {
      adjustedHour = 0; // Convert 12 AM to 0 hours
    }

    return dayjs()
      .set('hour', adjustedHour)
      .set('minute', minute)
      .set('second', 0)
      .toDate();
  }

  const time = dayjs(value, timeFormat);

  if (!time.isValid()) {
    return;
  }

  return time.toDate();
}
