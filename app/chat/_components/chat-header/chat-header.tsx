import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GuideBox from "../guide/guide-box";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SwipeGuideBox from "../guide/swipe-guide-box";

const ChatHeader = () => {
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
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center">
              <CircleHelp className="size-6 text-primary" />
            </button>
          </DialogTrigger>
          <DialogContent className="mobile-guide-dialog-content">
            <DialogHeader>
              <p className="text-title-s text-label-assistive">
                AI오피스 프롬프트 가이드{" "}
              </p>
              <DialogTitle>AI 어떻게 활용하면 좋을까요?</DialogTitle>
            </DialogHeader>

            <SwipeGuideBox />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatHeader;
