import ExperienceList from "./ExperienceList";
import experiences from "./Experiences.json";
import CertificationCard from "./CertificationCard";
import certifications from "./Certifications.json";
import { Job } from "@/components/components.d";

function Page3() {
  return (
    <>
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
        // ? INFO 자격증 개수 변경 시
        // ? 1. tailwind.config.js 이동
        // ? 2. scroll animation 조절 필요 (현재: 4) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex space-x-4 justify-center animate-scroll hover:[animation-play-state:paused] w-max">
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
