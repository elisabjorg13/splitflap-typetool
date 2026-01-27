"use client";

import './globals.css';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import SplitFlapLetter from './components/SplitFlapLetter';
import { CustomBounce } from "gsap/CustomBounce";
import { CustomEase } from "gsap/CustomEase";
import { GSDevTools } from 'gsap/GSDevTools';
gsap.registerPlugin(SplitText, ScrambleTextPlugin, CustomEase, CustomBounce, GSDevTools);

import Image from 'next/image';

// Removed top-level useEffect; moving inside component

type RotatingLetterProps = {
  letter: string;
  delay?: number;
  fontSize?: number;
  color?: string;
};

function RotatingLetter({ letter, delay = 0, fontSize = 80, color = '#000' }: RotatingLetterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { rotateX: 0 },
        {
          rotateX: 180,
          duration: 1.8,
          delay,
          ease: 'power1.in',
          repeat: -1,
        }
      );
    }
  }, [delay]);

  return (
    <span
      ref={ref}
      data-rotating
      style={{
        display: 'inline-block',
        fontFamily: 'Steina Playback VF',
        fontSize,
        color,
        backfaceVisibility: 'hidden',
      }}
    >
      {letter}
    </span>
  );
}


export default function Home() {
  const word1 = 'Steina';
  const word2 = 'Steina';
  const [sliderValue, setSliderValue] = useState(40);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimating2, setIsAnimating2] = useState(false);
  const animationRef1 = useRef<gsap.core.Tween | null>(null);
  const headerTlRef = useRef<gsap.core.Timeline | null>(null);

  // Rotating header effect (moved into component, proper cleanup)
  useEffect(() => {
    const tl = gsap.timeline({ paused: true, repeat: 2 });

    function initHeaders() {
      const header = document.querySelector('.rotatingHeader');
      if (!header) return;

      const original = header.querySelector('h1');
      if (!original) return;

      const clone = original.cloneNode(true) as HTMLElement;
      header.appendChild(clone);
      gsap.set(clone, { yPercent: -100 });

      const originalSplit = SplitText.create(original, { type: 'chars' });
      const cloneSplit = SplitText.create(clone, { type: 'chars' });

      const duration = 0.4;
      const stagger: gsap.StaggerVars = { each: 0.02, ease: 'power2', from: 'start' };

      gsap.set(cloneSplit.chars, { rotationX: -90, opacity: 0, transformOrigin: '50% 50% -50' });

      tl.to(originalSplit.chars, { duration, rotationX: 90, transformOrigin: '50% 50% -50', stagger });
      tl.to(originalSplit.chars, { duration, opacity: 0, stagger, ease: 'power4.in' }, 0);
      tl.to(cloneSplit.chars, { duration: 0.05, opacity: 1, stagger }, 0.001);
      tl.to(cloneSplit.chars, { duration, rotationX: 0, stagger }, 0);

      // GSDevTools.create({ animation: tl, minimal: false, container: '#devtools' });
      headerTlRef.current = tl;
    }

    initHeaders();

    return () => { tl.kill(); };
  }, []);

  // Simple hover-responsive fluctuation
  useEffect(() => {
    const text14 = document.querySelector('#text14') as HTMLElement;
    if (!text14) return;

    let isHovered = false;

    const handleMouseEnter = () => {
      isHovered = true;
    };
    
    const handleMouseLeave = () => {
      isHovered = false;
    };

    text14.addEventListener('mouseenter', handleMouseEnter);
    text14.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const split = SplitText.create(text14, { type: "chars" });
      const min = isHovered ? 70 : 10;
      const max = isHovered ? 95 : 30;

      split.chars.forEach((char, index) => {
        gsap.to(char, {
          duration: 2,
          delay: index * 0.3,
          ease: "power2.out",
          onUpdate: function() {
            const progress = this.progress();
            const value = Math.round(min + (max - min) * progress);
            (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
          },
          onComplete: () => {
            gsap.to(char, {
              duration: 2,
              ease: "power2.out",
              onUpdate: function() {
                const progress = this.progress();
                const value = Math.round(max - (max - min) * progress);
                (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
              },
              onComplete: () => {
                setTimeout(() => animate(), 1000);
              }
            });
          }
        });
      });
    };

    animate();

    return () => {
      text14.removeEventListener('mouseenter', handleMouseEnter);
      text14.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const playRotatingHeader = () => {
    if (headerTlRef.current) headerTlRef.current.restart();
  };


  const animateSlider = () => {

    setIsAnimating(true);

    const loopAnimation = () => {
      gsap.to({}, {
        duration: 2,
        onUpdate: function () {
          const progress = this.progress();
          const startValue = sliderValue;
          const value = Math.round(startValue + (100 - startValue) * progress);
          setSliderValue(value);
          const paragraph = document.querySelector('#text1') as HTMLElement;
          if (paragraph) {
            paragraph.style.fontVariationSettings = `'opsz' ${value}`;
          }
        },
        onComplete: () => {

          // Go from 100 down to 0
          gsap.to({}, {
            duration: 2,
            onUpdate: function () {
              const progress = this.progress();
              const value = Math.round(100 - (100 - 0) * progress);
              setSliderValue(value);
              const paragraph = document.querySelector('#text1') as HTMLElement;
              if (paragraph) {
                paragraph.style.fontVariationSettings = `'opsz' ${value}`;
              }
            },
            onComplete: () => {

              // Go from 0 back up to 100
              gsap.to({}, {
                duration: 2,
                onUpdate: function () {
                  const progress = this.progress();
                  const value = Math.round(0 + (100 - 0) * progress);
                  setSliderValue(value);
                  const paragraph = document.querySelector('#text1') as HTMLElement;
                  if (paragraph) {
                    paragraph.style.fontVariationSettings = `'opsz' ${value}`;
                  }
                },
                onComplete: () => {
                  // Loop back to start if still animating
                  if (isAnimating) {
                    setTimeout(() => loopAnimation(), 100);
                  }
                }
              });
            }
          });
        }
      });
    };

    loopAnimation();
  };



  // Use your existing button handler

  const animateOpszCharsFromEnd = (
    selector: string,
    opts: { start?: number; duration?: number; stagger?: number; max?: number; min?: number } = {}
  ) => {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      const { start = 40, duration = 1, stagger = 0.5, max = 100, min = 0 } = opts;
      const split = SplitText.create(el, { type: "chars" });

      const animateCharacters = () => {
        const total = split.chars.length;
        split.chars.forEach((char, index) => {
          gsap.to(char, {
            duration,
            delay: (total - 1 - index) * stagger,
            ease: "bounce.in",
            onUpdate: function () {
              const progress = this.progress();
              const value = Math.round(start + (max - start) * progress);
              (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
            },
            onComplete: () => {
              // Second animation: max to min
              gsap.to(char, {
                duration,
                ease: "bounce.in",
                onUpdate: function () {
                  const progress = this.progress();
                  const value = Math.round(max - (max - min) * progress);
                  (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                },
                onComplete: () => {
                  // Third animation: min to max
                  gsap.to(char, {
                    duration,
                    ease: "power4",
                    onUpdate: function () {
                      const progress = this.progress();
                      const value = Math.round(min + (max - min) * progress);
                      (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                    },
                    onComplete: () => {
                      // Loop the last two animations (max→min→max)
                      const loopLastTwo = () => {
                        // max to min
                        gsap.to(char, {
                          duration,
                          ease: "bounce.in",
                          onUpdate: function () {
                            const progress = this.progress();
                            const value = Math.round(max - (max - min) * progress);
                            (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                          },
                          onComplete: () => {
                            // min to max
                            gsap.to(char, {
                              duration,
                              ease: "power4",
                              onUpdate: function () {
                                const progress = this.progress();
                                const value = Math.round(min + (max - min) * progress);
                                (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                              },
                              onComplete: () => {
                                setTimeout(() => loopLastTwo(), 200);
                              }
                            });
                          }
                        });
                      };

                      setTimeout(() => loopLastTwo(), 200);
                    }
                  });
                }
              });
            }
          });
        });
      };

      animateCharacters();

    }
  };


  const animateOpszChars = (
    selector: string,
    opts: { start?: number; duration?: number; stagger?: number; max?: number; min?: number } = {}
  ) => {


    // Create SplitText instance
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      const { start = 40, duration = 1, stagger = 0.5, max = 100, min = 0 } = opts;
      const split = SplitText.create(el, { type: "chars" });

      const animateCharacters = () => {
        split.chars.forEach((char, index) => {
          gsap.to(char, {
            duration,
            delay: index * stagger,
            ease: "bounce.in",
            onUpdate: function () {
              const progress = this.progress();
              const value = Math.round(start + (max - start) * progress);
              (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
            },
            onComplete: () => {
              // Second animation: max to min
              gsap.to(char, {
                duration,
                ease: "bounce.in",
                onUpdate: function () {
                  const progress = this.progress();
                  const value = Math.round(max - (max - min) * progress);
                  (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                },
                onComplete: () => {
                  // Third animation: min to max
                  gsap.to(char, {
                    duration,
                    ease: "power4",
                    onUpdate: function () {
                      const progress = this.progress();
                      const value = Math.round(min + (max - min) * progress);
                      (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                    },
                    onComplete: () => {
                      // Loop the last two animations (max→min→max)
                      const loopLastTwo = () => {
                        // max to min
                        gsap.to(char, {
                          duration,
                          ease: "bounce.in",
                          onUpdate: function () {
                            const progress = this.progress();
                            const value = Math.round(max - (max - min) * progress);
                            (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                          },
                          onComplete: () => {
                            // min to max
                            gsap.to(char, {
                              duration,
                              ease: "power4",
                              onUpdate: function () {
                                const progress = this.progress();
                                const value = Math.round(min + (max - min) * progress);
                                (char as HTMLElement).style.fontVariationSettings = `'opsz' ${value}`;
                              },
                              onComplete: () => {
                                setTimeout(() => loopLastTwo(), 200);
                              }
                            });
                          }
                        });
                      };

                      setTimeout(() => loopLastTwo(), 200);
                    }
                  });
                }
              });
            }
          });
        });
      };

      animateCharacters();

    }
  };
  const animateText2 = () => {
    animateOpszChars("#text2", { start: 40, duration: 1, stagger: 0.5, max: 100, min: 0 });
  };
  const animateText3 = () => {
    animateOpszChars("#text3", { start: 40, duration: 1, stagger: 0.2, max: 60, min: 10 });
  };
  const animateText4 = () => {
    animateOpszChars("#text5", { start: 100, duration: 1, stagger: 0.2, max: 100, min: 70 });
    animateOpszCharsFromEnd("#text6", { start: 40, duration: 1, stagger: 0.2, max: 60, min: 10 });
  };
  const animateText5 = () => {
    animateOpszChars("#text7", { start: 100, duration: 1, stagger: 0.2, max: 100, min: 70 });
    animateOpszCharsFromEnd("#text8", { start: 40, duration: 1, stagger: 0.2, max: 60, min: 10 });
  };

  const animateText9 = () => {
    const el = document.querySelector("#text9") as HTMLElement;
    if (el) {
      const split = SplitText.create(el, { type: "chars" });
      
      // Create temporal ripple effect
      split.chars.forEach((char, index) => {
        const delay = index * 0.1;
        
        // Initial state
        gsap.set(char, { 
          scale: 0, 
          opacity: 0, 
          rotation: -180,
          transformOrigin: "center center"
        });
        
        // Temporal ripple animation
        gsap.to(char, {
          duration: 2,
          delay,
          scale: 1.2,
          opacity: 1,
          rotation: 0,
          ease: "elastic.out(1, 0.3)",
          onComplete: () => {
            // Ripple wave effect
            gsap.to(char, {
              duration: 1.5,
              scale: 1,
              ease: "power2.out"
            });
          }
        });
        
        // Split-flap inspired settling effect
        gsap.to(char, {
          duration: 1.2,
          delay: delay + 2.5,
          rotation: 15,
          ease: "power2.out",
          onComplete: () => {
            // Gentle settle back with bounce
            gsap.to(char, {
              duration: 0.8,
              rotation: 0,
              ease: "bounce.out"
            });
          }
        });
      });
    }
  };

  const animateText10 = () => {
    const el = document.querySelector("#text10") as HTMLElement;
    if (el) {
      const split = SplitText.create(el, { type: "chars" });
      
      // Split-flap inspired flying words effect
      split.chars.forEach((char, index) => {
        const delay = index * 0.15;
        
        // Initial state - normal split-flap position
        gsap.set(char, { 
          scale: 1, 
          opacity: 1, 
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          x: 0,
          y: 0,
          z: 0
        });
        
        // Phase 1: Fly off like ejected from split-flap
        gsap.to(char, {
          duration: 0.8,
          delay,
          scale: 1.3,
          opacity: 0.7,
          rotationX: 180,
          rotationY: 90,
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          z: (Math.random() - 0.5) * 100,
          ease: "power2.out",
          onComplete: () => {
            // Phase 2: Fly back on with split-flap settling
            gsap.to(char, {
              duration: 1.2,
              scale: 1,
              opacity: 1,
              rotationX: 0,
              rotationY: 0,
              x: 0,
              y: 0,
              z: 0,
              ease: "elastic.out(1, 0.3)",
              onComplete: () => {
                // Phase 3: Final split-flap settle with bounce
                gsap.to(char, {
                  duration: 0.4,
                  scale: 1.05,
                  ease: "bounce.out",
                  onComplete: () => {
                    gsap.to(char, {
                      duration: 0.3,
                      scale: 1,
                      ease: "power2.out"
                    });
                  }
                });
              }
            });
          }
        });
      });
    }
  };


  return (
    <div className='bg-[#000000]'>
      <div className="vh-100vh w-100vw">
        <div>
        {word1.split('').map((char, i, arr) => (
          <RotatingLetter key={i} letter={char} delay={(arr.length - 1 - i) * 0.15} fontSize={100} color="#000" />
        ))}
      </div>
      <div>
        {word2.split('').map((char, i, arr) => (
          <RotatingLetter key={i} letter={char} delay={(arr.length - 1 - i) * 0.15} fontSize={100} color="#888" />
        ))}
      </div> 
        <div className='flex flex-row h-full'>
          <div className='flex flex-col w-full p-2 ml-20 mt-20'>
          
            <h2> Interactive Hover Opsz</h2>
            <div className='flex flex-row gap-10 items-center'>
              <div className="text-[#d4f77d] text-[100px]" style={{ fontFamily: 'Steina Playback VF', fontVariationSettings: "'opsz' 100" }}>
                {word1.split('').map((char, index) => (
                  <span
                    key={index}
                    className="inline-block cursor-pointer transition-transform duration-200"
                    style={{ fontVariationSettings: "'opsz' 100" }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        duration: 0.3,
                        fontVariationSettings: "'opsz' 65",
                        ease: "power2.out"
                      });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        duration: 0.3,
                        fontVariationSettings: "'opsz' 100",
                        ease: "power2.out"
                      });
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          <h2>Staggered Opsz Progression</h2>
            <div className='flex flex-row gap-10 items-center'>
              <div>
                <Image
                  src="/images/button.png"
                  alt="button"
                  width={20}
                  height={10}
                  style={{ width: '30px', height: '30px' }}
                  onClick={() => {
                    const text12 = document.querySelector('#text12') as HTMLElement;
                    if (text12) {
                      const split = SplitText.create(text12, { type: "chars" });
                      const targets = [100, 85, 45, 25, 80, 100]; // S, t, e, i, n, a
                      
                      split.chars.forEach((char, index) => {
                        gsap.to(char, {
                          duration: 1.5,
                          delay: index * 0.2,
                          ease: "power2.out",
                          onUpdate: function() {
                            const progress = this.progress();
                            const startValue = 30;
                            const endValue = targets[index];
                            const currentValue = Math.round(startValue + (endValue - startValue) * progress);
                            (char as HTMLElement).style.fontVariationSettings = `'opsz' ${currentValue}`;
                          }
                        });
                      });
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
              <div id="text12" className="text-white text-[100px]" style={{ fontFamily: 'Steina Playback VF', fontVariationSettings: "'opsz' 30" }}>
                Steina
              </div>
            </div> 
             <h2>8. Staggered Opsz + Interactive Hover</h2>
            <div className='flex flex-row gap-10 items-center'>
              <div>
                <Image
                  src="/images/button.png"
                  alt="button"
                  width={20}
                  height={10}
                  style={{ width: '30px', height: '30px' }}
                  onClick={() => {
                    const text13 = document.querySelector('#text13') as HTMLElement;
                    if (text13) {
                      const split = SplitText.create(text13, { type: "chars" });
                      const targets = [100, 85, 45, 25, 80, 100]; // S, t, e, i, n, a
                      
                      split.chars.forEach((char, index) => {
                        gsap.to(char, {
                          duration: 1.5,
                          delay: index * 0.2,
                          ease: "power2.out",
                          onUpdate: function() {
                            const progress = this.progress();
                            const startValue = 30;
                            const endValue = targets[index];
                            const currentValue = Math.round(startValue + (endValue - startValue) * progress);
                            (char as HTMLElement).style.fontVariationSettings = `'opsz' ${currentValue}`;
                          }
                        });
                      });
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
              <div id="text13" className="text-[#d4f77d] text-[100px]" style={{ fontFamily: 'Steina Playback VF', fontVariationSettings: "'opsz' 30" }}>
                {word1.split('').map((char, index) => (
                  <span
                    key={index}
                    className="inline-block cursor-pointer transition-transform duration-200"
                    style={{ 
                      fontVariationSettings: "'opsz' 30",
                      width: '1ch', // Force fixed width
                      display: 'inline-block',
                      textAlign: 'center',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      const targets = [100, 85, 45, 25, 80, 100]; // S, t, e, i, n, a
                      gsap.to(e.currentTarget, {
                        duration: 0.3,
                        fontVariationSettings: `'opsz' ${targets[index]}`,
                        ease: "power2.out"
                      });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        duration: 0.3,
                        fontVariationSettings: "'opsz' 30",
                        ease: "power2.out"
                      });
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div> 


          </div>
        </div>
      </div>
    </div>
  );
}
