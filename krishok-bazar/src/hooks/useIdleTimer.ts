import { useEffect, useRef } from 'react';

/**
 * Custom hook to track user idle time and trigger a callback.
 * Checks for user interaction like clicking, scrolling, typing, or moving the mouse.
 * 
 * @param timeoutSeconds - The idle duration in seconds before triggering onIdle.
 * @param onIdle - Callback triggered when the user becomes idle.
 * @param enabled - Enable or disable the idle timer check.
 */
export function useIdleTimer(
  timeoutSeconds: number,
  onIdle: () => void,
  enabled: boolean
) {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: NodeJS.Timeout;

    const refreshTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onIdleRef.current();
      }, timeoutSeconds * 1000);
    };

    // User activity event listeners
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Initialize/start the idle timer
    refreshTimer();

    // Attach listeners
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, refreshTimer, { passive: true });
    });

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, refreshTimer);
      });
    };
  }, [timeoutSeconds, enabled]);
}
