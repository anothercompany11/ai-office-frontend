import { User } from "@/app/api/dto";
import { useState } from "react";
import ChatInput from "./chat-input";
import ChargeCoinModal from "../sidebar/charge-coin-modal";

const EmptyChatScreen = ({
  createNewConversation,
  user,
}: {
  createNewConversation: (firstMsg: string) => void;
  user: User;
}) => {
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  // 코인 충전 모달 열기 함수
  const openChargeModal = () => {
    setIsChargeModalOpen(true);
  };

  // 코인 충전 모달 닫기 함수
  const closeChargeModal = () => {
    setIsChargeModalOpen(false);
  };

  // 코인 충전 확인 처리 함수
  const handleConfirmCharge = (password: string) => {
    // 여기에 코인 충전 로직을 구현합니다
    console.log("코인 충전 처리, 암호:", password);
    closeChargeModal();
  };

  return (
    <div className="h-full flex-col relative web:gap-10 flex items-center  justify-center px-5">
      <div className="flex flex-col gap-2 text-center pb-[116px] web:pb-0">
        <p className="text-title-s text-label-natural">토르</p>
        <p className="text-[24px] text-label-strong font-hakgyo-ansim">
          지금 어떤 생각을 하고 있으신가요?
        </p>
      </div>
      <div className="w-full web:mt-0 absolute web:relative pb-4 web:pb-0 max-w-[680px] px-4 web:px-0 bg-line-alternative mx-auto bottom-0 z-10">
        <div className="tab:pb-10 tab:px-0 web:pb-20 mx-auto">
          <ChatInput
            user={user}
            onSend={createNewConversation}
            onChargeRequest={openChargeModal}
          />
        </div>
      </div>

      {/* 코인 충전 모달 */}
      <ChargeCoinModal
        isOpen={isChargeModalOpen}
        onClose={closeChargeModal}
        title="코인 충전"
      />
    </div>
  );
};
export default EmptyChatScreen;
