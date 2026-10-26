/**
 * Utilidades para formatear y manipular horas y horarios del evento
 */

export function formatTime12h(timeStr?: string): string {
  if (!timeStr) return '';
  const clean = timeStr.trim();

  // Si ya contiene AM/PM, devolverlo limpio y estandarizado
  if (/am|pm/i.test(clean)) {
    return clean.replace(/([0-9])\s*(am|pm)/i, '$1 $2').toUpperCase();
  }

  const parts = clean.split(':');
  if (parts.length < 2) return clean;

  const h = parseInt(parts[0], 10);
  const m = parts[1].slice(0, 2);
  if (isNaN(h)) return clean;

  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const padH = h12 < 10 ? `0${h12}` : `${h12}`;
  const padM = m.padStart(2, '0');

  return `${padH}:${padM} ${ampm}`;
}

export function formatEventSchedule(startTime?: string, endTime?: string): string {
  const start = formatTime12h(startTime || '14:00');
  const end = formatTime12h(endTime || '18:00');

  if (start && end) {
    return `${start} a ${end}`;
  }
  return start || end || '02:00 PM a 06:00 PM';
}

export function formatEventScheduleWithHours(startTime?: string, endTime?: string): string {
  const schedule = formatEventSchedule(startTime, endTime);
  const cleanStart = (startTime || '14:00').trim().slice(0, 5);
  const cleanEnd = (endTime || '18:00').trim().slice(0, 5);

  if (cleanStart && cleanEnd) {
    return `${schedule} (${cleanStart} - ${cleanEnd} hrs)`;
  }
  return schedule;
}
