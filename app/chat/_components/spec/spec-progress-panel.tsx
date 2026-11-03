"use client";

import { Check, FileText, Loader2 } from "lucide-react";
import { SpecCoverage } from "@/app/api/dto/spec";
import { Button } from "@/components/ui/button";

interface Props {
  coverage: SpecCoverage | null;
  /** 결과물 생성이 진행 중인지 */
  generating: boolean;
  /** 이미 만들어 둔 결과물이 있는지 — 있으면 버튼 문구가 바뀐다 */
  hasSpec: boolean;
  /** 대화 중 하려는 일이 바뀌어 정리 기준이 교체됐는지 */
  checklistReset?: boolean;
  onGenerate: () => void;
  onOpenSpec: () => void;
}

/**
 * 채팅 입력창 위에 붙어 진행 상황을 보여주는 패널.
 *
 * 사용자에게 체크리스트 전체를 들이밀면 설문지처럼 느껴지므로,
 * 평소에는 채운 개수만 보여주고 다음에 다룰 내용 한 줄만 덧붙인다.
 *
 * 항목 개수는 대화마다 다르다. 응답의 items 를 그대로 그리고, 개수를 가정하지 않는다.
 */
const SpecProgressPanel = ({
  coverage,
  generating,
  hasSpec,
  checklistReset = false,
  onGenerate,
  onOpenSpec,
}: Props) => {
  if (!coverage) return null;

  const { filled, total, ready, missing_hint, items } = coverage;
  // 아직 무엇을 정리할지 안 읽힌 대화에서는 패널을 띄우지 않는다
  if (total === 0) return null;
  // 대화를 막 시작했고 결과물도 없으면 패널을 띄우지 않는다 (빈 진행바가 거슬린다)
  if (filled === 0 && !hasSpec) return null;

  const percent = total > 0 ? Math.round((filled / total) * 100) : 0;
  const actionLabel = coverage.deliverable_label || "결과물 만들기";

  return (
    <div className="mb-3 rounded-xl border border-line bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-s font-bold text-label-strong">
              {ready ? "필요한 내용이 다 모였어요" : "정리하는 중"}
            </span>
            <span className="text-body-s text-label-natural">
              {filled} / {total}
            </span>
          </div>

          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background-alternative"
            role="progressbar"
            aria-valuenow={filled}
            aria-valuemin={0}
            aria-valuemax={total}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                ready ? "bg-primary" : "bg-label-assistive"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {hasSpec ? (
          <Button size="sm" variant="outline" onClick={onOpenSpec}>
            <FileText size={16} />
            결과 보기
          </Button>
        ) : null}

        <Button
          size="sm"
          onClick={onGenerate}
          disabled={generating}
          variant={ready ? "default" : "outline"}
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              만드는 중
            </>
          ) : hasSpec ? (
            "다시 만들기"
          ) : (
            actionLabel
          )}
        </Button>
      </div>

      {/* 항목이 통째로 바뀌면 개수가 줄어든다. 이유를 말해주지 않으면 버그로 보인다 */}
      {checklistReset ? (
        <p className="mt-2 text-body-s text-label-natural">
          방향이 바뀌어서 정리 기준을 다시 잡았어요.
        </p>
      ) : null}

      {/* 아직 덜 찼을 때만 다음에 다룰 내용을 한 줄로 귀띔한다 */}
      {!ready && missing_hint ? (
        <p className="mt-2 text-body-s text-label-natural">{missing_hint}</p>
      ) : null}

      {ready ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-1 rounded-full bg-background-alternative px-2 py-0.5 text-[11px] text-label-natural"
            >
              <Check size={11} className="text-primary" />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SpecProgressPanel;
