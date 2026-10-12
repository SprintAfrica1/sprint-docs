// src/hooks/useReducedMotion.ts
//
// Returns true when the visitor prefers reduced motion. Always false on
// the server and on first render so SSR markup and hydration match.

import { useEffect, useState } from 'react';

export default function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}