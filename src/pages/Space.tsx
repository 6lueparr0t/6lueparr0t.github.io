import React, { Suspense } from "react";
import {
  Await,
} from "react-router-dom";

// import { RouteLoaderData } from "@/pages/pages.d";

const SpacePage: React.FC = () => {
  return (
    <div className="font-['DungGeunMo'] p-8">
      <div className="text-2xl text-left">Space</div>
      <div className="my-4 flex flex-row justify-between">
        [검색창 위치]
      </div>
      <div className="flex flex-col justify-center items-center">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={true}>
            {/* {(list) => ( */}
              {/* <> */}
                [게시글 리스트]
              {/* </> */}
            {/* )} */}
          </Await>
        </Suspense>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={true}>
            {/* {(last) => ( */}
              {/* <> */}
                <div className="w-full flex flex-col justify-evenly items-center mt-20">
                  [페이지 네이션]
                </div>
              {/* </> */}
            {/* )} */}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

export default SpacePage;
