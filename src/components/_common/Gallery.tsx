// import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useRef, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbs,
} from "@/components/ui/carousel";

import profile1 from "@/assets/home/profile1.webp";
import profile2 from "@/assets/home/profile2.webp";
import profile3 from "@/assets/home/profile3.webp";
import profile4 from "@/assets/home/profile4.webp";

const IMAGES: string[] = [profile1, profile2, profile3, profile4];

export const Gallery: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrent] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      console.warn("IntersectionObserver is not supported in this environment.");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && componentRef.current) {
        componentRef.current.focus({ preventScroll: true });
      }
    });

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex justify-center items-center p-4 dark:shadow-white-2xl w-72 md:w-[400px] h-[650px]">
      <Carousel
        className="outline-none"
        ref={componentRef}
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={
          [
            // Autoplay({
            //   delay: 5000,
            //   stopOnInteraction: false,
            //   stopOnMouseEnter: true,
            // }),
          ]
        }
        onKeyDownCapture={(e) => {
          if (api && e.key === "ArrowRight") {
            api.scrollNext();
          } else if (api && e.key === "ArrowLeft") {
            api.scrollPrev();
          }
        }}
        tabIndex={0}
      >
        <CarouselContent>
          {IMAGES.map((image) => (
            <CarouselItem key={image} className="flex items-center justify-center">
              <img className="flex items-center" src={image} alt={`Placeholder Image ${image}`} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <div className="flex justify-center mt-4">
        {Array.from({ length: IMAGES.length }, (_, num) => num).map((num) => (
          <span
            key={num}
            className={`cursor-pointer inline-block w-3 h-3 rounded-full mx-2 ${
              num + 1 === current ? "bg-gray-200" : "bg-zinc-900"
            }`}
            onClick={() => api && api.scrollTo(num)}
          />
        ))}
      </div> */}
        <CarouselThumbs slides={IMAGES.map((_, index) => index)} images={IMAGES} className="mt-4" />
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
