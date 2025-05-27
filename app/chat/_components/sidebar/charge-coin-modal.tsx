import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";
import CouponForm from "@/app/chat/_components/coupon/coupon-form";

interface ChargeCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function ChargeCoinModal({
  isOpen,
  onClose,
  title,
}: ChargeCoinModalProps) {
  const isMob = useGetCurrentDevice() === "mob";

  const handleSuccess = () => {
    // 쿠폰 적용 성공 후 모달창 자동 닫기
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-8">
        <div className="bg-white pt-6 max-w-[520px] mx-auto w-full text-center tab:text-left px-4 pb-4 space-y-6 border-[#EEEFF1] rounded-[20px]">
          <div className="flex flex-col gap-2 tab:gap-5">
            <DialogTitle className="text-title-l text-label-strong">
              {title}
            </DialogTitle>

            <div className="w-full">
              <CouponForm onSuccess={handleSuccess} onClose={onClose} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
