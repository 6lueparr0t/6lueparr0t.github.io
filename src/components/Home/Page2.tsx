import Ash from "./Ash";

function Page2() {
  return (
    <div className="mx-auto text-center max-w-[calc(100%)] h-[calc(100lvh)] bg-slate-100 dark:bg-slate-900">
      <div className="flex sticky justify-center top-[0.4rem] py-4 z-10">Experience</div>
      <div className="flex items-end h-[calc(100lvh-5rem)] p-4">
        <Ash />
      </div>
    </div>
  );
}

export default Page2;
