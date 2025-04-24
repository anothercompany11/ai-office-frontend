import Image from "next/image";

const GuideData = [
  {
    src: "conversation",
    title: "일상 대화",
    guideList: [
      {
        title: "메뉴 추천",
        desc: "지금 계절에 맞는 제철음식을 추천해줘",
      },
      {
        title: "날씨 확인",
        desc: "오늘 날씨랑 미세먼지 농도 알려줘",
      },
      {
        title: "할일 정리",
        desc: "오늘 할일 투두 리스트 만들어줘",
      },
    ],
  },
  {
    src: "inquiry",
    title: "주제 탐구",
    guideList: [
      {
        title: "논문 검색",
        desc: "해당 주제에 대한 논문 검색해줘",
      },
      {
        title: "심화 질문",
        desc: "지구 중력은 어떤 원리로 작용하는거야?",
      },
      {
        title: "난이도 설정",
        desc: "전기 발명 과정을 이해하기 쉽게 알려줘",
      },
    ],
  },
];

const GuideBox = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-title-s mb-2 text-label-natural">
          AI오피스 프롬프트 가이드
        </p>
        <p className="text-title-1 font-hakgyo-ansim">{`AI 어떻게 활용하면 좋을까요?`}</p>
      </div>
      <div className="flex gap-4">
        {GuideData.map((guide) => (
          <GuideCard key={guide.src} {...guide} />
        ))}
      </div>
    </div>
  );
};
export default GuideBox;

interface GuideCardProps {
  src: string;
  title: string;
  guideList: {
    title: string;
    desc: string;
  }[];
}

const GuideCard = ({ src, title, guideList }: GuideCardProps) => {
  return (
    <div className="rounded-xl border border-line flex flex-col gap-4 bg-white py-6 px-4 w-[280px]">
      <div className="flex flex-col items-center gap-1">
        <Image
          src={`/png/icon/${src}.png`}
          alt="웃는 얼굴"
          width={59}
          height={60}
        />
        <p className="text-title-3">{title}</p>
      </div>
      <div className="flex flex-col gap-2">
        {guideList.map((guide) => (
          <div
            className="p-3 bg-background-alternative flex flex-col gap-1 rounded-sm"
            key={guide.title}
          >
            <p className="text-subtitle-s">{guide.title}</p>
            <p className="text-body-s text-label">{guide.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
