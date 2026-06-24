import Image from "next/image";

const GuideData = [
  // {
  //   src: "conversation",
  //   title: `📝 사용 방법`,
  //   guideList: [
  //     {
  //       desc: "궁금한 내용을 채팅창에 입력하면 바로 답을 받을 수 있어요.",
  //     },
  //     {
  //       desc: "사람과 대화하듯 편하게 질문하세요.",
  //     },
  //     {
  //       desc: "질문이 구체적일 수록 더 정확한 답을 받을 수 있어요.",
  //     },
  //   ],
  // },
  {
    src: "inquiry",
    title: `⚠️ 유의사항`,
    guideList: [
      {
        desc: "질문은 ‘200자 이내’로 작성해야 해요.",
      },
      {
        desc: "질문을 한 번 할 때마다 코인이 1개씩 줄어들어요.",
      },
      {
        desc: "코인이 다 떨어지면 더 이상 질문할 수 없어요.",
      },
      {
        desc: "코인을 획득하려면 수업시간의 미션들을 통해 획득할 수 있어요.",
      },
    ],
  },
];

const GuideBox = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* <div className="text-center">
        <p className="text-title-1 font-hakgyo-ansim">{`AI 토르`}</p>
      </div> */}
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
    desc: string;
  }[];
}

const GuideCard = ({ src, title, guideList }: GuideCardProps) => {
  return (
    <div className="rounded-xl border border-line flex flex-col gap-4 bg-white py-6 px-4 w-[330px]">
      <div className="flex flex-col items-center gap-1">
        <Image
          src={`/png/icon/${src}.png`}
          alt="웃는 얼굴"
          width={59}
          height={60}
        />
      </div>
      <div>
        <h3 className="text-center text-title-2 font-hakgyo-ansim mb-4">
          {title}
        </h3>
        <div className="flex flex-col gap-2">
          {guideList.map((guide) => (
            <div
              className="p-3 bg-background-alternative flex flex-col gap-1 rounded-sm"
              key={guide.desc}
            >
              <p className="text-body-s text-label break-words">{guide.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
