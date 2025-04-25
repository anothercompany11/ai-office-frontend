import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent) => void;
  title: string;
}

export default function TwoButtonModal({
  isOpen,
  onClose,
  onConfirm,
  title,
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
              {`삭제된 내용은 다시 복구할 수 없으며\n모든 대화 내용이 영구적으로 삭제됩니다.`}
            </p>
          </div>
          <div className="flex gap-2 w-full text-[14px] justify-end font-bold">
            <button
              onClick={onClose}
              className="tab:w-[84px] w-full h-12 border border-line-strong rounded-full text-title-s bg-white"
            >
              취소
            </button>
            <button
              onClick={(e: React.MouseEvent) => onConfirm(e)}
              className="tab:w-[97px] w-full h-12 rounded-full text-title-s bg-[#00AC78] text-white"
            >
              삭제하기
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
