import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Job } from "@/components/components.d";

const ExperienceList = ({ job }: { job: Job }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(job.type === "company");
  }, [job.type]);

  return (
    <>
      <div
        key={job.title}
        className="mx-8 my-16 p-4 rounded-lg ring-zinc-300 dark:ring-zinc-800 ring-4"
      >
        <div className="text-lg font-bold flex justify-between items-center">
          <div>
            {job.title}&nbsp;
            {job?.url && (
              <a className="text-blue-600 dark:text-blue-400" href={job.url} target="_blank">
                #
              </a>
            )}
          </div>
          <div className="cursor-pointer" onClick={toggleAccordion}>
            {isOpen ? (
              <ChevronUpIcon className="w-[24px] h-[24px]" />
            ) : (
              <ChevronDownIcon className="w-[24px] h-[24px]" />
            )}
          </div>
        </div>
        {/* type 이 personal 인 경우에만 숨기기 */}
        <div>
          <div className="flex justify-between">
            <div className="text-zinc-700 dark:text-zinc-400 text-left">{job.role}</div>
            <div className="text-zinc-700 dark:text-zinc-400 text-right">{job.period}</div>
          </div>
          <div className={isOpen ? "" : "hidden"}>
          <ul className="py-4">
            {job.details.map((detail: { project: string; link?: string; tasks: string[] }) => (
              <li
                key={detail.project}
                className="mt-4 font-semibold text-gray-950 dark:text-gray-50"
              >
                {detail.project}{" "}
                {detail?.link && (
                  <a
                    className="text-blue-600 dark:text-blue-400"
                    href={detail.link}
                    target="_blank"
                  >
                    #
                  </a>
                )}
                <ul className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300">
                  {detail.tasks.map((task, taskIdx) => (
                    <li key={taskIdx}>{task}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            {job?.techStack?.languages ? <div>Tech Stack: {job?.techStack?.languages}</div> : null}
            {job?.techStack?.scm ? <div>SCM: {job?.techStack?.scm}</div> : null}
            {job?.techStack?.cicd ? <div>CI/CD : {job?.techStack?.cicd}</div> : null}
          </div>
          {job?.link?.length && (
            <div className={`mt-4 ${isOpen ? "" : "hidden"}`}>
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
                  {(linkIdx < (job?.link?.length ?? 0) - 1) && " / "}
                </span>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExperienceList;
