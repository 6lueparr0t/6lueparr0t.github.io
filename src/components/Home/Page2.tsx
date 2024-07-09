import { NavLink } from "react-router-dom";
import ash2 from "@/assets/ash2.gif";

function Page2() {
  return (
    <div className="mx-auto text-center max-w-[calc(100%)] h-[calc(100lvh)] bg-slate-100 dark:bg-slate-900">
      <div className="flex sticky justify-center top-[0.4rem] py-4">
        Work
      </div>
      <div className="flex items-end h-[calc(100lvh-5rem)] p-4">
        <div className="sticky bottom-6">
          <NavLink
            to={"/about"}
            className={
              "text-gray-800 hover:text-gray-400  dark:text-gray-100 dark:hover:text-gray-500"
            }
            end
          >
            <img className="sm:w-[20px] sm:h-[20px] w-[16px] h-[16px]" src={ash2} alt="ash-going" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Page2;
