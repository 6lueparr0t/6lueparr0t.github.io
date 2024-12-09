import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ChipProps extends React.PropsWithChildren {
  title: ReactNode;
  content: ReactNode;
}

const Chip: React.FC<ChipProps> = ({ title = <></>, content = <></> }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="px-2 h-6 mx-2">{title}</Button>
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
};

export default Chip;
