/**
 * MindCare Toast Notification Utility
 * Replaces all browser alert() calls with non-blocking, auto-dismissing toasts.
 * Usage: import { toast } from '../utils/toast';
 *        toast.success('Saved!');
 *        toast.error('Failed to save.');
 *        toast.info('Please contact admin.');
 *        toast.warn('Invalid input.');
 */

const TOAST_DURATION = 4000; // ms

const show = (message, type = 'info') => {
  // Remove existing toasts of same type to avoid stacking
  const existing = document.querySelectorAll(`.mc-toast-${type}`);
  existing.forEach(el => el.remove());

  const colors = {
    success: { bg: '#10B981', icon: '✅' },
    error:   { bg: '#EF4444', icon: '❌' },
    warn:    { bg: '#F59E0B', icon: '⚠️' },
    info:    { bg: '#3B82F6', icon: 'ℹ️' },
  };

  const { bg, icon } = colors[type] || colors.info;

  // Find highest existing toast to stack properly
  const existing2 = document.querySelectorAll('.mc-toast');
  const topOffset = 20 + (existing2.length * 70);

  const div = document.createElement('div');
  div.className = `mc-toast mc-toast-${type}`;
  div.style.cssText = `
    position: fixed;
    top: ${topOffset}px;
    right: 20px;
    z-index: 99999;
    padding: 14px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    color: white;
    max-width: 380px;
    min-width: 240px;
    background: ${bg};
    display: flex;
    align-items: center;
    gap: 10px;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: translateX(0);
    cursor: pointer;
    word-break: break-word;
    line-height: 1.4;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;
  div.innerHTML = `<span style="font-size:18px;flex-shrink:0">${icon}</span><span>${message}</span><span style="margin-left:auto;opacity:0.7;font-size:18px;flex-shrink:0">×</span>`;
  document.body.appendChild(div);

  const dismiss = () => {
    div.style.opacity = '0';
    div.style.transform = 'translateX(40px)';
    setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, 300);
  };

  div.addEventListener('click', dismiss);

  const timer = setTimeout(dismiss, TOAST_DURATION);
  div._toastTimer = timer;
};

export const toast = {
  success: (msg) => show(msg, 'success'),
  error:   (msg) => show(msg, 'error'),
  warn:    (msg) => show(msg, 'warn'),
  info:    (msg) => show(msg, 'info'),
};

export default toast;
