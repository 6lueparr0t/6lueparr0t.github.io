import { ReactTyped } from "react-typed";

function Page1() {
  return (
    <div className="mx-auto p-4 text-center max-w-[calc(100%)] h-[calc(100vh-12rem)] flex flex-col justify-center">
      <h1 className="text-6xl break-keep m-4 text-gradient">
        <ReactTyped strings={["Hello, World!"]} startDelay={500} typeSpeed={100} />
      </h1>
      <h2 className="text-4xl break-keep text-gradient">One for a line, a line for all.</h2>
    </div>
  );
}

export default Page1;
