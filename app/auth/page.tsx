"use client";

import Image from "next/image";
import Logo from "../shared/logo";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex bg-gradient items-center justify-center min-h-screen">
      <div className="bg-[#102B24] shadow-original border-[#74ac97] rounded-[20px] w-full flex flex-col gap-10 items-center py-10 px-6 max-w-[350px] border">
        <div className="flex flex-col gap-6 items-center">
          <Logo />
          <Image
            src={"/svg/logo-text.svg"}
            alt="토르"
            width={232}
            height={52}
          />
        </div>
        <div className="flex flex-col gap-4 text-white">
          <Image
            src={"/png/char-smile.png"}
            alt="환영하는 얼굴"
            width={120}
            height={108}
            className="mx-auto"
          />
          <p className="text-subtitle-s text-center">{`GREEN FIT에 입사하신 여러분 환영합니다!\n코드를 입력하여 토르에 입장해주세요.`}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
