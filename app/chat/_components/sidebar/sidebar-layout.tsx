import { ChevronsLeftIcon } from "lucide-react";
import Image from "next/image";

const SidebarLayout = ({
  children,
  isVisible,
  onClose,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
}) => {
  return (
    <div
      className={`${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } fixed inset-0 z-50 h-full w-[280px] flex flex-col bg-white px-4 transition-transform duration-300`}
    >
      <div className="flex items-center justify-between py-[21.5px]">
        <Image src="/svg/logo.svg" alt="logo" width={97.45} height={18.21} />
        <button onClick={onClose}>
          <ChevronsLeftIcon size={24} />
        </button>
      </div>
      {children}
    </div>
  );
};
export default SidebarLayout;
