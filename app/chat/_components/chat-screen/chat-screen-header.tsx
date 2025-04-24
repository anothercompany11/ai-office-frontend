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

const ChatScreenHeader = () => {
  const [showMobileGuide, setShowMobileGuide] = useState(false);

  const guideContents = [
    {
      title: "일반 대화",
      items: [
        {
          title: "메뉴 추천",
          description: "지금 계절에 맞는 제철음식을 추천해줘",
        },
        {
          title: "날씨 확인",
          description: "오늘 날씨링 미세먼지 농도 알려줘",
        },
        {
          title: "힐링 정리",
          description: "오늘 힐링 투두 리스트 만들어줘",
        },
      ],
    },
    {
      title: "날씨 확인",
      items: [
        {
          title: "일기 예보",
          description: "이번 주 날씨는 어떨까?",
        },
        {
          title: "미세먼지",
          description: "오늘 마스크 써야할까?",
        },
      ],
    },
    {
      title: "힐링 정리",
      items: [
        {
          title: "투두리스트",
          description: "오늘의 할일을 정리해볼까?",
        },
        {
          title: "일정관리",
          description: "이번주 일정을 관리해줘",
        },
      ],
    },
  ];

  return (
    <div className="py-5 px-8 flex justify-between items-center">
      {/* <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #fca5a5 !important;
        }
        .swiper-pagination-bullet-active {
          background-color: #000000 !important;
        }
      `}</style> */}
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
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>Chat AI 오피스 가이드</DialogTitle>
            </DialogHeader>
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              className="w-full h-[400px]"
            >
              {guideContents.map((section, index) => (
                <SwiperSlide key={index} className="p-4">
                  <div className="h-full">
                    <h3 className="text-lg font-bold mb-4">{section.title}</h3>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      ))}
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
