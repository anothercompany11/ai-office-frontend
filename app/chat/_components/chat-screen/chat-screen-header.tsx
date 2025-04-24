import { CircleHelp } from "lucide-react";
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
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const ChatScreenHeader = () => {
  const [showMobileGuide, setShowMobileGuide] = useState(false);

  const guideContents = [
    {
      imageUrl: "/png/guide-1.png",
      title: "일반 대화",
      items: [
        {
          title: "메뉴 추천",
          description: "지금 계절에 맞는 제철음식을 추천해줘",
        },
        {
          title: "날씨 확인",
          description: "오늘 날씨랑 미세먼지 농도 알려줘",
        },
        {
          title: "할일 정리",
          description: "오늘 할일 투두 리스트 만들어줘",
        },
      ],
    },
    {
      imageUrl: "/png/guide-2.png",
      title: "주제 탐구",
      items: [
        {
          title: "논문 검색",
          description: "해당 주제에 대한 논문 검색해줘",
        },
        {
          title: "심화 질문",
          description: "지구 중력은 어떤 원리로 작용하는거야?",
        },
        {
          title: "난이도 설정",
          description: "전기 발명 과정을 이해하기 쉽게 알려줘",
        },
      ],
    },
  ];

  return (
    <div className="py-5 px-8 flex justify-between items-center">
      <p className="text-body-l font-hakgyo-ansim">Chat AI 오피스</p>

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
          <DialogContent className="mobile-guide-dialog-content">
            <DialogHeader>
              <p className="text-title-s text-label-assistive">
                AI오피스 프롬프트 가이드{" "}
              </p>
              <DialogTitle>AI 어떻게 활용하면 좋을까요?</DialogTitle>
            </DialogHeader>
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              className="w-full mobile-guide-swiper"
            >
              {guideContents.map((section, index) => (
                <SwiperSlide key={index} className="px-[14px]">
                  <div className="h-full bg-white rounded-xl">
                    <div className="h-[200px] bg-gray-100 rounded-t-xl">
                      <Image
                        src={section.imageUrl}
                        alt="AI 어떻게 활용하면 좋을까요?"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover rounded-t-xl"
                      />
                    </div>
                    <div className="px-3 pt-4 pb-6">
                      <h3 className="text-center text-title-2 font-hakgyo-ansim mb-4">
                        {section.title}
                      </h3>
                      <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="p-3 space-y-1 bg-background-alternative rounded-lg"
                          >
                            <h4 className="text-subtitle-s">{item.title}</h4>
                            <p className="text-body-s text-label">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatScreenHeader;
