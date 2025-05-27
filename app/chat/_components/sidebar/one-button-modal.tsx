import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent) => void;
  title: string;
  description?: string;
}

export default function OneButtonModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: Props) {
  const isMob = useGetCurrentDevice() === "mob";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-8">
        <div className="bg-white pt-6 max-w-[520px] mx-auto w-full text-center tab:text-left px-4 pb-4 space-y-6 border-[#EEEFF1] rounded-[20px]">
          <div className="flex flex-col gap-2 tab:gap-5">
            <DialogTitle className="text-title-l text-label-strong">
              {title}
            </DialogTitle>
            <p
              className={
                isMob
                  ? "text-subtitle-s text-label-natural"
                  : "text-body-2 tab:whitespace-nowrap text-label-strong"
              }
            >
              {description}
            </p>
          </div>
          <div className="flex gap-2 w-full text-[14px] justify-end font-bold">
            <Button onClick={(e: React.MouseEvent) => onConfirm(e)} size={"lg"}>
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
