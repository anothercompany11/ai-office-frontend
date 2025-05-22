import { CircleHelp, ChevronsRight } from "lucide-react";
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

interface Props {
  isSidebarVisible: boolean;
  setIsSidebarVisible: (visible: boolean) => void;
}

const ChatHeader = ({ isSidebarVisible, setIsSidebarVisible }: Props) => {
  return (
    <div className="px-4 py-3 z-10 fixed top-0 inset-x-0 tab:relative tab:py-5 tab:px-8 flex justify-between items-center">
      <div className="flex items-center">
        <div className="hidden web:block">
          {!isSidebarVisible && (
            <button
              onClick={() => setIsSidebarVisible(true)}
              className="flex items-center justify-center mr-4"
            >
              <ChevronsRight className="size-6 text-component" />
            </button>
          )}
        </div>
        <div className="block relative z-50 web:hidden">
          <button
            onClick={() => setIsSidebarVisible(true)}
            className="flex items-center justify-center"
          >
            <ChevronsRight className="size-6 text-component" />
          </button>
        </div>
        <p className="text-body-l font-hakgyo-ansim block web:hidden absolute left-1/2 -translate-x-1/2">
          Chat AI 오피스
        </p>
        <p className="text-body-l font-hakgyo-ansim hidden web:block">
          Chat AI 오피스
        </p>
      </div>

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-hakgyo-ansim">
                AI오피스 프롬프트 가이드
              </DialogTitle>
            </DialogHeader>

            <SwipeGuideBox />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatHeader;
