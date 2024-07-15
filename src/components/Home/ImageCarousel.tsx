import React, { useState, useEffect } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import profile1 from "@/assets/home/profile1.webp";
import profile2 from "@/assets/home/profile2.webp";
import profile3 from "@/assets/home/profile3.webp";
import profile4 from "@/assets/home/profile4.webp";

const IMAGES:string[] = [
  profile1,
  profile2,
  profile3,
  profile4,
]

export const ImageCarousel: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {IMAGES.map((image) => (
          <CarouselItem key={image} className="flex items-center justify-center">
            <img className="flex items-center" src={image} alt={`Placeholder Image ${image}`}/>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        {Array.from({ length: IMAGES.length }, (_, num) => num).map((num) => (
          <span
            key={num}
            className={`cursor-pointer inline-block w-3 h-3 rounded-full mx-2 ${
              num + 1 === current ? "bg-gray-200" : "bg-slate-900"
            }`}
            onClick={() => api && api.scrollTo(num)}
          />
        ))}
      </div>
    </Carousel>
  );
};
