import ExperienceList from "./ExperienceList";
import experiences from "./Experiences.json";
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
        <h2 className="text-2xl">Certifications</h2>
        <div className="flex flex-col items-center font-noto">
          {certifications.map((certification) => (
            <div key={certification.title} className="text-xl">
              {certification.title}{" "}
              <span className="text-sm">
                ({certification.issuer}, {certification.date})
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Page3;
