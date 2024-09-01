import experience from "./experience.json";
import ExperienceList from "./ExperienceList";
import { Job } from "@/components/components.d";

function Page3() {
  return (
    <>
      <div id="experience" className="mx-auto text-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          experience
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="font-noto w-full sm:w-full md:w-full lg:w-2/3 xl:w-1/2 text-left break-keep">
            {experience.map((job) => (
              <ExperienceList key={job.title} job={job as Job} />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-16 flex flex-col items-center space-y-2">
        <h2 className="text-2xl">Certifications</h2>
        <div className="flex flex-col items-center font-noto">
          <div className="text-xl">
            정보처리기사 <span className="text-sm">(한국산업인력공단, 2019.08)</span>
          </div>
          <div className="text-xl">
            컴퓨터활용능력 1급 <span className="text-sm">(대한상공회의소, 2009.08)</span>
          </div>
          <div className="text-xl">
            CKAD <span className="text-sm">(The Linux Foundation, 2023.02)</span>
          </div>
          <div className="text-xl">
            AWS Developer Associate <span className="text-sm">(Amazon Web Services, 2022.12)</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page3;
