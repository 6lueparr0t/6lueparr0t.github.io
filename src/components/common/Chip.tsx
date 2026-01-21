import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChipProps extends React.PropsWithChildren {
  title: ReactNode;
  content: ReactNode;
}

const Chip: React.FC<ChipProps> = ({ title = <></>, content = <></> }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="px-2 h-6">{title}</Button>
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
};

export default Chip;
