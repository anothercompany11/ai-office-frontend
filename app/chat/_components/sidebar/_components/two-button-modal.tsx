import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent) => void;
  title: string;
  description: string;
}

export default function TwoButtonModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="absolute bg-white border tab:w-[534px] border-[#EEEFF1] rounded-[20px] p-6 flex flex-col justify-center items-end gap-6">
        <div className="w-full space-y-6">
          <DialogTitle className="text-title-l text-label-strong">
            {title}
          </DialogTitle>
          <p className="text-body-m text-label-strong tab:whitespace-nowrap">
            {description}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="w-[84px] h-[48px] border border-line-strong rounded-full text-title-s bg-white"
            >
              취소
            </button>
            <button
              onClick={(e: React.MouseEvent) => onConfirm(e)}
              className="w-[97px] h-[48px] rounded-full text-title-s bg-[#00AC78] text-white"
            >
              삭제하기
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
