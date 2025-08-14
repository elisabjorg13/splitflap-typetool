import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import '../globals.css';

export default function SplitFlapLetter() {
  const LETTERS = ['B', 'E', 'A'];
  const tailwindTopRef = useRef<HTMLDivElement>(null);
  const tailwindBottomRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [flipTrigger, setFlipTrigger] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  const current = LETTERS[index];
  const next = LETTERS[(index + 1) % LETTERS.length];

  useEffect(() => {
    if (loopCount >= 10) return; // Stop after 10 loops

    const timeout = setTimeout(() => {
      gsap.fromTo(
        tailwindTopRef.current,
        { rotateX: 0 },
        {
          rotateX: -90,
          duration: 0.1,
          transformOrigin: 'bottom center',
          ease: 'power2',
          onComplete: () => {
               if (tailwindTopRef.current) {
            tailwindTopRef.current.innerHTML = `
              <div class="overflow-hidden flex items-end rotate-180 scale-x-[-1]">
                ${next}
              </div>
            `;
          }
            gsap.fromTo(
              tailwindTopRef.current,
              { rotateX: -90 },
              {
                rotateX: -180,
                duration: 0.1,
                transformOrigin: 'bottom center',
                ease: 'power2',
                onComplete: () => {

                  setIndex((i) => (i + 1) % LETTERS.length);
                  setLoopCount((c) => c + 1);
                  gsap.set(tailwindTopRef.current, { rotateX: 0 });
                  if (tailwindBottomRef.current) {
                    tailwindBottomRef.current.style.visibility = 'visible';
                  }
                }
              }
            );
          },
        }
      );
    }, 200);

    return () => clearTimeout(timeout);
  }, [flipTrigger, loopCount]);

  return (
    <div>

      <div
        style={{ fontFamily: 'Times New Roman' }}
        className="w-[100px] relative h-[160px] flex flex-col text-[160px] leading-none relative mt-8 justify-center text-black"
      >

        <div ref={tailwindTopRef} className={`h-1/2 overflow-hidden flex z-10 bg-red-500`}>
          {current}
        </div>
        <div className="h-1/2 overflow-hidden flex items-start absolute inset-0 z-0 bg-red-500">
          {next}
        </div>
        <div ref={tailwindBottomRef} className="h-1/2 overflow-hidden flex items-end bg-red-500">
          {current}
        </div>
      </div>
    </div>
  );
}