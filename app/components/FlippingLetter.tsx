'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type FlippingLetterProps = {
  from: string;
  to: string;
  fontSize?: number;
};

export default function FlippingLetter({ from, to, fontSize = 80 }: FlippingLetterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Flip out
    gsap.to(el, {
      rotateX: 90,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        if (el) el.textContent = to;
        // Flip in
        gsap.to(el, {
          rotateX: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      },
    });
  }, [to]);

  return (
    <div
      ref={ref}
      style={{
        display: 'inline-block',
        transformStyle: 'preserve-3d',
        transformOrigin: 'top center',
        fontSize,
        fontFamily: 'Steina Playback VF',
      }}
    >
      {from}
    </div>
  );
}
