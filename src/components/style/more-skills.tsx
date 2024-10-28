"use client";

import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  skill_icon_convex,
  skill_icon_next_auth,
  skill_icon_nextjs,
  skill_icon_react,
  skill_icon_tailwindcss,
} from "../../../public";

const MoreSkills = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    console.log(`Current index: ${emblaApi.selectedScrollSnap()}`);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const skills = [
    { icon: skill_icon_nextjs, name: "Next.js", alt: "Next.js icon" },
    { icon: skill_icon_react, name: "React", alt: "React icon" },
    { icon: skill_icon_convex, name: "Convex", alt: "Convex icon" },
    {
      icon: skill_icon_tailwindcss,
      name: "Tailwind CSS",
      alt: "Tailwind CSS icon",
    },
    {
      icon: skill_icon_next_auth,
      name: "Next Auth",
      alt: "Next Auth  icon",
    },
  ];

  return (
    <div className="py-10 flex flex-col max-w-6xl mx-auto px-4">
      <div
        id="skills-header"
        className="prose mx-auto prose-lg text-center mb-12"
      >
        <h1 className="">You don&apos;t need more than this, I know</h1>
        <p className="text-gray-600">
          Mastering the perfect stack for modern web development. Combining the
          power of Next.js, React, Convex, and Tailwind CSS to build scalable,
          beautiful, and performant applications.
        </p>
      </div>

      <div className="embla overflow-hidden  rounded-xl  p-8" ref={emblaRef}>
        <div className="embla__container flex">
          {[...Array(2)].map((_, arrayIndex) => (
            <div
              key={`skill-group-${arrayIndex}`}
              className="flex-[0_0_100%] min-w-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
            >
              {skills.map((skill, index) => (
                <div
                  key={`skill-${index}-${arrayIndex}`}
                  className="flex flex-col items-center justify-center cursor-pointer p-4 hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={skill.icon}
                      alt={skill.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <span className="text-lg font-medium text-gray-800">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Optional Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(2)].map((_, index) => (
          <button
            key={`dot-${index}`}
            className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MoreSkills;
