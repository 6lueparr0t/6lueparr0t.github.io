import ExperienceList from "./ExperienceList";
import experiences from "./Experiences.json";
import CertificationCard from "./CertificationCard";
import certifications from "./Certifications.json";
import { Job } from "@/components/components.d";

function Page3() {
  return (
    <>
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
      <div className="mb-16 flex flex-col items-center space-y-2">
        <h2 className="text-2xl mb-4">Certifications</h2>
        {/* // ? INFO 자격증 개수 변경 시, tailwind.config.js -> scroll animation 조절 필요 (현재: 4) */}
        <div className="relative w-[236px * 3 * 4]">
          <div className="flex space-x-4 justify-center animate-scroll hover:[animation-play-state:paused]">
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.title}
                title={certification.title}
                issuer={certification.issuer}
                date={certification.date}
              />
            ))}
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.title + "2"}
                title={certification.title}
                issuer={certification.issuer}
                date={certification.date}
              />
            ))}
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.title + "3"}
                title={certification.title}
                issuer={certification.issuer}
                date={certification.date}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page3;
