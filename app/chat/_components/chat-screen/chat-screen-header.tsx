import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GuideBox from "../guide/guide-box";

const ChatScreenHeader = () => {
  return (
    <div className="py-5 px-8 flex justify-between items-center">
      <p className="text-body-l font-hakgyo-ansim">Chat AI 오피스</p>
      <div className="hidden web:block">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center">
              <CircleHelp className="size-6 text-primary" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[640px] p-6 bg-white border border-[hsla(220,10%,94%,1)] shadow-[4px_4px_20px_0px_hsla(0,0%,0%,0.1)]"
            align="end"
          >
            <GuideBox />
          </PopoverContent>
        </Popover>
      </div>
      <div className="block web:hidden">
        <button className="flex items-center justify-center">
          <CircleHelp className="size-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreenHeader;
