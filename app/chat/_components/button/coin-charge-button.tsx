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
        className="bg-gradient-to-b text-[13px] web:text-[16px] font-hakgyo-ansim rounded-[5px] px-[13px] h-[33px] text-black from-[#96FEB7] to-[#28CC92] shadow-[inset_0.43px_0.43px_1.06px_0px_#FFFFFFCC,inset_-0.43px_-0.43px_1.06px_0px_#F0924180]"
        onClick={openChargeModal}
      >
        코인 충전
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
