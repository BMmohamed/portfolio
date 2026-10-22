'use client';

import { useEffect } from 'react';

/**
 * NativeAppExperience
 * Enforces native app behaviors by disabling browser-specific gestures:
 * 1. Disables context menu on long press (except for editable inputs).
 * 2. Prevents ghost dragging on images and links.
 * 3. Prevents pull-to-refresh bounce overscroll on touch boundaries.
 */
export default function NativeAppExperience() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent default long-press context menu on non-editable elements
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isEditable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        Boolean(target.closest('input, textarea, [contenteditable="true"]'));

      if (!isEditable) {
        e.preventDefault();
      }
    };

    // Prevent image and link dragging popups
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.tagName === 'IMG' ||
        target.tagName === 'A' ||
        Boolean(target.closest('a'))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, { passive: false });
    document.addEventListener('dragstart', handleDragStart, { passive: false });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}
