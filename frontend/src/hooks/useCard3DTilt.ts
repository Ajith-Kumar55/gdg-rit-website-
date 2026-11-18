import { useEffect } from 'react';

/**
 * Attaches a single lightweight delegated pointer listener that applies subtle
 * 3D perspective tilt (--rx, --ry) and specular sheen position (--mx, --my)
 * to any hovered `.card-3d` or `.glass-panel-hover` surface.
 *
 * Automatically disables on touch devices or when `prefers-reduced-motion: reduce`
 * is active. Zero DOM wrapping and zero React re-renders.
 */
export function useCard3DTilt() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReduced || !hasFinePointer) return;

    let activeCard: HTMLElement | null = null;
    let rafId = 0;

    const resetCard = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };

    const handlePointerMove = (e: PointerEvent) => {
      const target = e.target instanceof Element
        ? (e.target.closest('.card-3d, .glass-panel-hover') as HTMLElement | null)
        : null;

      if (activeCard && activeCard !== target) {
        resetCard(activeCard);
        activeCard = null;
      }

      if (!target) return;
      activeCard = target;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);

        // Subtle, controlled studio tilt (max +/- 4.2 degrees)
        const rotY = (px - 0.5) * 8.4;
        const rotX = (0.5 - py) * 7.2;

        target.style.setProperty('--rx', `${rotX.toFixed(2)}deg`);
        target.style.setProperty('--ry', `${rotY.toFixed(2)}deg`);
        target.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        target.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (!activeCard) return;
      const related = e.relatedTarget instanceof Node ? e.relatedTarget : null;
      if (!related || !activeCard.contains(related)) {
        resetCard(activeCard);
        activeCard = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resetCard(activeCard);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
    };
  }, []);
}
