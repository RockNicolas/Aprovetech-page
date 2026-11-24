'use client';

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('aprovetech-theme', next);
    } catch {}
  }
  return (
    <button
      className="icon-btn"
      type="button"
      onClick={toggle}
      aria-label="Alternar tema claro e escuro"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.4A6 6 0 0 1 12.4 3.1 9 9 0 0 0 12 3Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
