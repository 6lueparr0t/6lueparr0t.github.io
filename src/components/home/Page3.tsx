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
      <div></div>
    </>
  );
}

export default Page3;
