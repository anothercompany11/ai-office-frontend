import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const SwipeGuideBox = () => {
  const guideContents = [
    {
      title: `📝 사용 방법`,
      items: [
        {
          description: "궁금한 내용을 채팅창에 입력하면\n바로 답을 받을 수 있어요.",
        },
        {
          description: "사람과 대화하듯 편하게 질문하세요.",
        },
        {
          description: "질문이 구체적일 수록 더 정확한 답을 받을 수 있어요.",
        },
      ],
    },
    {
      title: `⚠️ 유의사항`,
      items: [
        {
          description: "질문은 ‘150자 이내’로 작성해야 해요.",
        },
        {
          description: "질문을 한 번 할 때마다 코인이 1개씩 줄어들어요.",
        },
        {
          description: "코인이 다 떨어지면 더 이상 질문할 수 없어요.",
        },
        {
          description: "코인을 획득하려면 수업시간의 미션들을 통해 획득할 수 있어요.",
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
                    <p className="text-body-s break-words text-label">{item.description}</p>
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
