import { useCallback, useEffect, useRef, useState } from "react";

import { specApi } from "@/app/api/spec";
import { ProjectSpec, SpecCoverage } from "@/app/api/dto/spec";

/** 새 대화는 아직 서버에 없으므로 조회하지 않는다 */
const isRealConversation = (id: string | null | undefined) =>
  !!id && id !== "new";

/** 판정이 끝날 때까지 기다리는 예산. 방향이 바뀐 턴은 모델 호출이 두 번 직렬로 돈다 */
const POLL_INTERVAL_MS = 1500;
const POLL_ATTEMPTS = 14;

/**
 * 한 대화의 준비 상태와 결과물을 다룬다.
 *
 * 준비 상태는 서버가 채팅 응답이 끝난 뒤 백그라운드로 다시 판정하므로,
 * 응답이 끝났다는 신호(refreshCoverage)를 받으면 잠시 뒤 다시 조회한다.
 */
export function useSpec(conversationId: string | null) {
  const [coverage, setCoverage] = useState<SpecCoverage | null>(null);
  const [spec, setSpec] = useState<ProjectSpec | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 대화 중 하려는 일이 바뀌어 정리 기준이 교체됐는지. 알려주지 않으면 진행 개수가
  // 줄어든 것이 버그로 보인다.
  const [checklistReset, setChecklistReset] = useState(false);

  // 대화가 바뀌면 이전 대화의 폴링이 새 대화 상태를 덮어쓰지 않도록 막는다
  const activeId = useRef(conversationId);
  const lastRevision = useRef(0);
  useEffect(() => {
    activeId.current = conversationId;
    lastRevision.current = 0;
    setCoverage(null);
    setSpec(null);
    setError(null);
    setChecklistReset(false);
  }, [conversationId]);

  const applyCoverage = useCallback((next: SpecCoverage) => {
    if (lastRevision.current > 0 && next.revision > lastRevision.current) {
      setChecklistReset(true);
    }
    lastRevision.current = next.revision;
    setCoverage(next);
  }, []);

  const loadCoverage = useCallback(async () => {
    if (!isRealConversation(conversationId)) return;
    const requestedFor = conversationId;
    const res = await specApi.getCoverage(conversationId as string);
    if (activeId.current !== requestedFor) return;
    if (res.status === "success" && res.data) applyCoverage(res.data);
  }, [conversationId, applyCoverage]);

  const loadSpec = useCallback(async () => {
    if (!isRealConversation(conversationId)) return;
    const requestedFor = conversationId;
    const res = await specApi.getLatest(conversationId as string);
    if (activeId.current !== requestedFor) return;
    // 아직 만든 적이 없으면 404 가 정상이다
    if (res.status === "success" && res.data) setSpec(res.data);
  }, [conversationId]);

  // 대화를 열 때 한 번 현재 상태를 읽어온다
  useEffect(() => {
    void loadCoverage();
    void loadSpec();
  }, [loadCoverage, loadSpec]);

  /**
   * 채팅 응답이 끝난 뒤 호출한다.
   *
   * 서버의 판정은 응답 스트림이 끝난 다음 백그라운드로 돌기 때문에
   * 바로 조회하면 직전 상태가 온다. 값이 바뀔 때까지 몇 번 더 본다.
   */
  const refreshCoverage = useCallback(async () => {
    if (!isRealConversation(conversationId)) return;
    const requestedFor = conversationId;
    const beforeFilled = coverage?.filled ?? -1;
    const beforeRevision = coverage?.revision ?? -1;

    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      if (activeId.current !== requestedFor) return;

      const res = await specApi.getCoverage(conversationId as string);
      if (activeId.current !== requestedFor) return;
      if (res.status !== "success" || !res.data) continue;

      applyCoverage(res.data);
      // 개수만 보면 방향이 바뀐 턴에서 낡은 분모가 화면에 남는다.
      // 첫 턴처럼 채운 것이 없는 경우도 있으니 판본 변화도 같이 본다.
      if (
        res.data.filled !== beforeFilled ||
        res.data.revision !== beforeRevision
      ) {
        return;
      }
    }
  }, [conversationId, coverage?.filled, coverage?.revision, applyCoverage]);

  /** 결과물을 만든다. 이미 있으면 대화를 반영한 새 버전을 만든다 */
  const generate = useCallback(async () => {
    if (!isRealConversation(conversationId)) return null;
    const requestedFor = conversationId;

    setGenerating(true);
    setError(null);
    try {
      const res = await specApi.generate(conversationId as string);
      if (activeId.current !== requestedFor) return null;

      if (res.status === "success" && res.data) {
        setSpec(res.data);
        return res.data;
      }
      setError(res.message || "결과물을 만들지 못했어요.");
      return null;
    } catch (e) {
      if (activeId.current !== requestedFor) return null;
      setError(e instanceof Error ? e.message : "결과물을 만들지 못했어요.");
      return null;
    } finally {
      if (activeId.current === requestedFor) setGenerating(false);
    }
  }, [conversationId]);

  return {
    coverage,
    spec,
    generating,
    error,
    checklistReset,
    clearError: () => setError(null),
    clearChecklistReset: () => setChecklistReset(false),
    refreshCoverage,
    generate,
  };
}
