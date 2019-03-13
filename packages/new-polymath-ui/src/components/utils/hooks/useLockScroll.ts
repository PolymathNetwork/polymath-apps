import { useLayoutEffect } from 'react';
import scrollbarWidth from 'scrollbarwidth';

export function useLockScroll(
  isLocked: boolean,
  options: {
    el: HTMLElement;
    delay?: number;
  }
) {
  useLayoutEffect(
    () => {
      const { el, delay } = options;
      // Get original body overflow
      const originalStyle = { ...window.getComputedStyle(el) };

      if (isLocked) {
        // Prevent scrolling on mount
        el.style.overflow = 'hidden';
        el.style.paddingRight = `${scrollbarWidth()}px`;
      }

      // Re-enable scrolling when component unmounts
      return () => {
        if (isLocked) {
          setTimeout(() => {
            el.style.overflow = originalStyle.overflow;
            el.style.paddingRight = originalStyle.paddingRight;
          }, delay);
        }
      };
    },
    [isLocked]
  );
}
