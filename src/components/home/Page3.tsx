import data from "./experience.json";

function Page3() {
  console.log(data);
  return (
    <>
      <div className="mx-auto text-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          experience
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="font-noto w-full lg:w-1/3 text-left break-keep">
            {data.map((job, index) => (
              <div key={index} className="mx-8 mt-8 mb-16 p-4 rounded-lg ring-zinc-800 ring-8">
                <div className="flex justify-between">
                  <div className="text-lg font-bold">{job.company}</div>
                </div>
                <div className="text-gray-600 text-right">{job.period}</div>
                <ul className="list-disc list-inside py-4">
                  {job.details.map((detail, idx) => (
                    <li key={idx} className="mt-4">
                      {detail.project}
                      <ul className="list-decimal list-inside">
                        {detail.tasks.map((task, taskIdx) => (
                          <li key={taskIdx}>{task}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <div>Tech Stack: {job.techStack.languages}</div>
                  <div>SCM: {job.techStack.scm}</div>
                  {job.techStack.cicd?<div>CI/CD : {job.techStack.cicd}</div>:null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page3;
