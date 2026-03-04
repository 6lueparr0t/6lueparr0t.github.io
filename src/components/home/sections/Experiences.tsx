import { Job } from "@/components/components.d";
import certifications from "@/components/home/data/Certifications.json";
import experiences from "@/components/home/data/Experiences.json";
import ExperienceList from "@/components/home/elements/ExperienceList";

function Experiences() {
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
      <div
        id="experiences"
        className="mx-auto text-center bg-zinc-50 dark:bg-zinc-950 min-h-screen flex flex-col items-center"
      >
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          experiences
        </div>

        <div className="flex flex-1 flex-col justify-center items-center w-full">
          <div className="font-noto w-11/12 sm:w-5/6 md:w-4/5 lg:w-2/3 xl:w-1/2 text-left break-keep mx-auto">
            {experiences.map((job) => (
              <ExperienceList key={job.title} job={job as Job} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Experiences;
