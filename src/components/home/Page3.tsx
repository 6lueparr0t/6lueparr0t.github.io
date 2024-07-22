import experience from "./experience.json";

function Page3() {
  return (
    <>
      <div className="mx-auto text-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          experience
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="font-noto w-full lg:w-1/3 text-left break-keep">
            {experience.map((job) => (
              <div
                key={job.company}
                className="mx-8 mt-8 mb-16 p-4 rounded-lg ring-zinc-300 dark:ring-zinc-800 ring-8"
              >
                <div className="text-lg font-bold">{job.company}</div>
                <div className="flex justify-between">
                  <div className="text-zinc-700 dark:text-zinc-400 text-left">{job.role}</div>
                  <div className="text-zinc-700 dark:text-zinc-400 text-right">{job.period}</div>
                </div>
                <ul className="list-disc list-inside py-4">
                  {job.details.map(
                    (detail: { project: string; link?: string; tasks: string[] }, idx) => (
                      <li key={detail.project} className="mt-4">
                        {detail.project}{" "}
                        {detail?.link && (
                          <a
                            className="text-blue-600 dark:text-blue-400"
                            href={detail.link}
                            target="_blank"
                          >
                            #{idx + 1}
                          </a>
                        )}
                        <ul className="list-decimal list-inside">
                          {detail.tasks.map((task, taskIdx) => (
                            <li key={taskIdx}>{task}</li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
                <div className="mt-4">
                  {job?.techStack?.languages ? (
                    <div>Tech Stack: {job?.techStack?.languages}</div>
                  ) : null}
                  {job?.techStack?.scm ? <div>SCM: {job?.techStack?.scm}</div> : null}
                  {job?.techStack?.cicd ? <div>CI/CD : {job?.techStack?.cicd}</div> : null}
                </div>
                {job?.link?.length && (
                  <div className="mt-4">
                    관련 링크 : &nbsp;
                    {job.link.map((link, linkIdx) => (
                      <span key={link.title}>
                        <a
                          className="text-blue-600 dark:text-blue-400"
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.title}
                        </a>
                        {linkIdx < job.link.length - 1 && " / "}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page3;
