import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const SwipeGuideBox = () => {
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
          description: "오늘 날씨랑 미세먼지 농도 알려줘",
        },
        {
          title: "할일 정리",
          description: "오늘 할일 투두 리스트 만들어줘",
        },
      ],
    },
    {
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
    <Swiper
      modules={[Pagination]}
      pagination={{
        clickable: true,
        bulletClass: "swiper-pagination-bullet",
        bulletActiveClass: "swiper-pagination-bullet-active",
      }}
      className="w-full h-full max-h-[530px] mobile-guide-swiper"
    >
      {guideContents.map((section, index) => (
        <SwiperSlide key={index} className="px-[14px]">
          <div className="h-full bg-white rounded-xl">
            <div className="h-[200px] bg-gray-100 rounded-t-xl">
              <Image
                src={`/png/guide-${index + 1}.png`}
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
                    <p className="text-body-s text-label">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default SwipeGuideBox;
