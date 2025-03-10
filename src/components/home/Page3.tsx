import { Job } from "@/components/components.d";

import CertificationCard from "./CertificationCard";
import certifications from "./Certifications.json";
import ExperienceList from "./ExperienceList";
import experiences from "./Experiences.json";

function Page3() {
  return (
    <>
      {/* Define keyframes and animation styles locally */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-236px * ${certifications.length}));
          }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
          &:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
      {/* Experiences Section */}
      <div id="experiences" className="mx-auto text-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          Experiences
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="font-noto w-full sm:w-full md:w-full lg:w-2/3 xl:w-1/2 text-left break-keep">
            {experiences.map((job) => (
              <ExperienceList key={job.title} job={job as Job} />
            ))}
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="mb-16 flex flex-col items-center space-y-2">
        <h2 className="text-2xl mb-4">Certifications</h2>
        {/*
        // ? INFO
        // ? tailwind.config.js 에 정의된 scroll 애니메이션 제거 후 컴포넌트에 애니메이션 추가
        // ? hover:[animation-play-state:paused] 클래스 제거
        */}
        <div className="relative w-full overflow-hidden">
          <div className="flex space-x-4 justify-center w-max animate-scroll">
            {Array(5)
              .fill(certifications)
              .flat()
              .map((certification, index) => (
                <CertificationCard
                  key={`${certification.title}-${index}`}
                  id={certification.id}
                  title={certification.title}
                  issuer={certification.issuer}
                  date={certification.date}
                  expired={certification.expired ?? undefined}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page3;
