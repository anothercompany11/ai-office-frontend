import { Button } from "@/components/ui/button";
import ChargeCoinModal from "../sidebar/charge-coin-modal";
import { useState } from "react";

const CoinChargeButton = () => {
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  // 코인 충전 모달 열기
  const openChargeModal = () => setIsChargeModalOpen(true);

  // 코인 충전 모달 닫기
  const closeChargeModal = () => setIsChargeModalOpen(false);

  return (
    <>
      <Button
        className="bg-gradient-to-b from-[#93DAC5] to-[#B5E3D5] text-[#015750] text-[13px] web:text-[16px] font-extrabold rounded-full px-[18px] h-[33px] shadow-[inset_0px_1px_2px_0px_#FFFFFF99]"
        onClick={openChargeModal}
      >
        코인충전
      </Button>

      <ChargeCoinModal
        isOpen={isChargeModalOpen}
        onClose={closeChargeModal}
        title="코인 충전"
      />
    </>
  );
};

export default CoinChargeButton;
