import Ash from "./Ash";
import profile from "/bird1.webp";

function Page2() {
  return (
    <>
      <Ash />
      <div className="mx-auto text-center h-[calc(100lvh)] bg-stone-100 dark:bg-slate-900">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          about me
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-center items-center p-4 bg-white shadow-2xl">
            <img src={profile} alt="profile" className="w-72 md:w-[330px] h-72 md:h-[330px]" />
          </div>
        </div>
      </div>
      <div className="mx-auto text-center h-[calc(100lvh)] bg-slate-50 dark:bg-slate-950">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          experience
        </div>
      </div>
      <div className="mx-auto text-center h-[calc(100lvh)] bg-stone-100 dark:bg-slate-900">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          now
        </div>
      </div>
    </>
  );
}

export default Page2;
