/**
 * MindCare Mental Health Therapy & Session Tracking System
 * Utility Helper Functions
 */

/**
 * Formats a date value into a human-readable string.
 *
 * Supports the following format tokens:
 *   yyyy - 4-digit year          yy   - 2-digit year
 *   MMMM - full month name       MMM  - abbreviated month name
 *   MM   - zero-padded month     M    - month (no padding)
 *   dd   - zero-padded day       d    - day (no padding)
 *   EEEE - full weekday name     EEE  - abbreviated weekday name
 *   HH   - 24-hour (padded)      H    - 24-hour (no padding)
 *   hh   - 12-hour (padded)      h    - 12-hour (no padding)
 *   mm   - minutes (padded)      ss   - seconds (padded)
 *   a    - AM/PM
 *
 * @param {Date|string|number} date - The date to format.
 * @param {string} [format='MMM dd, yyyy'] - The format pattern.
 * @returns {string} The formatted date string, or '—' if invalid.
 */
export function formatDate(date, format = 'MMM dd, yyyy') {
  if (!date) return '—';

  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday',
  ];
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const weekday = d.getDay();
  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  const pad = (n) => String(n).padStart(2, '0');

  // Order matters: longer tokens must come before shorter ones to avoid
  // partial replacements (e.g. "MMMM" before "MMM" before "MM" before "M").
  const tokenMap = [
    ['yyyy', String(year)],
    ['yy', String(year).slice(-2)],
    ['MMMM', months[month]],
    ['MMM', monthsShort[month]],
    ['MM', pad(month + 1)],
    ['M', String(month + 1)],
    ['dd', pad(day)],
    ['d', String(day)],
    ['EEEE', days[weekday]],
    ['EEE', daysShort[weekday]],
    ['HH', pad(hours24)],
    ['H', String(hours24)],
    ['hh', pad(hours12)],
    ['h', String(hours12)],
    ['mm', pad(minutes)],
    ['ss', pad(seconds)],
    ['a', ampm],
  ];

  let result = format;
  for (const [token, value] of tokenMap) {
    result = result.replace(new RegExp(token, 'g'), value);
  }
  return result;
}

/**
 * Formats a time string (HH:mm or HH:mm:ss) into 12-hour format.
 *
 * @param {string} time - The time string in 24-hour format.
 * @returns {string} The formatted time string (e.g. "2:30 PM"), or '—' if invalid.
 */
export function formatTime(time) {
  if (!time) return '—';

  const parts = String(time).split(':');
  if (parts.length < 2) return '—';

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return '—';

  const h12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${h12}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

/**
 * Formats a numeric amount as US currency.
 *
 * @param {number} amount - The dollar amount.
 * @returns {string} The formatted currency string (e.g. "$1,250.00").
 */
export function formatCurrency(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Returns up to two uppercase initials from a first and last name.
 *
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string} The initials (e.g. "JD").
 */
export function getInitials(firstName, lastName) {
  const first = (firstName || '').trim().charAt(0).toUpperCase();
  const last = (lastName || '').trim().charAt(0).toUpperCase();
  return `${first}${last}`;
}

/**
 * Maps a status string to a Bootstrap/custom colour class suffix.
 *
 * @param {string} status - The status value.
 * @returns {string} A colour identifier suitable for badge / label classes.
 */
export function getStatusColor(status) {
  const colorMap = {
    // Client statuses
    Active: 'success',
    Inactive: 'secondary',
    Discharged: 'info',
    Waitlist: 'warning',
    PendingIntake: 'primary',
    OnHold: 'warning',
    Deceased: 'dark',

    // Appointment statuses
    Scheduled: 'primary',
    Confirmed: 'info',
    CheckedIn: 'info',
    InProgress: 'warning',
    Completed: 'success',
    Cancelled: 'danger',
    NoShow: 'danger',
    Rescheduled: 'warning',
    LateCancelled: 'danger',

    // Billing statuses
    Draft: 'secondary',
    Pending: 'warning',
    Submitted: 'primary',
    Accepted: 'success',
    Rejected: 'danger',
    Paid: 'success',
    PartiallyPaid: 'info',
    Denied: 'danger',
    Appealed: 'warning',
    Void: 'dark',
    WriteOff: 'dark',
  };

  return colorMap[status] || 'secondary';
}

/**
 * Maps a crisis level to a colour identifier.
 *
 * @param {string} level - The crisis level value.
 * @returns {string} A colour identifier.
 */
export function getCrisisLevelColor(level) {
  const colorMap = {
    None: 'success',
    Low: 'info',
    Moderate: 'warning',
    High: 'orange',
    Critical: 'danger',
    Imminent: 'danger',
  };
  return colorMap[level] || 'secondary';
}

/**
 * Truncates text to a given length, appending an ellipsis when shortened.
 *
 * @param {string} text - The string to truncate.
 * @param {number} [maxLength=100] - The maximum length before truncation.
 * @returns {string} The (possibly truncated) text.
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Calculates the age in full years from a date of birth.
 *
 * @param {Date|string} dob - The date of birth.
 * @returns {number|null} The age, or null if the input is invalid.
 */
export function calculateAge(dob) {
  if (!dob) return null;

  const birthDate = dob instanceof Date ? dob : new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

/**
 * Generates a unique client number in the format "MC-XXXXXXXX"
 * where X is an uppercase alphanumeric character.
 *
 * @returns {string} A client number (e.g. "MC-4F8A2B1C").
 */
export function generateClientNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MC-${id}`;
}

/**
 * Returns a debounced version of the given function.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} [delay=300] - Delay in milliseconds.
 * @returns {Function} The debounced function (with a `.cancel()` method).
 */
export function debounce(fn, delay = 300) {
  let timeoutId = null;

  const debounced = (...args) => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Conditionally joins CSS class names, filtering out falsy values.
 *
 * @param {...(string|boolean|null|undefined)} classes - Class names or falsy values.
 * @returns {string} The joined class string.
 *
 * @example
 *   classNames('btn', isActive && 'btn-active', hasError && 'btn-error');
 *   // → "btn btn-active" (when isActive is true, hasError is false)
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
