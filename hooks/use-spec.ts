import { useCallback, useEffect, useRef, useState } from "react";

import { specApi } from "@/app/api/spec";
import { ProjectSpec, SpecCoverage } from "@/app/api/dto/spec";

/** 새 대화는 아직 서버에 없으므로 조회하지 않는다 */
const isRealConversation = (id: string | null | undefined) =>
  !!id && id !== "new";

/**
 * 한 대화의 기획 완성도와 구현 명세를 다룬다.
 *
 * 완성도는 서버가 채팅 응답이 끝난 뒤 백그라운드로 다시 판정하므로,
 * 응답이 끝났다는 신호(refreshCoverage)를 받으면 잠시 뒤 다시 조회한다.
 */
export function useSpec(conversationId: string | null) {
  const [coverage, setCoverage] = useState<SpecCoverage | null>(null);
  const [spec, setSpec] = useState<ProjectSpec | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 대화가 바뀌면 이전 대화의 폴링이 새 대화 상태를 덮어쓰지 않도록 막는다
  const activeId = useRef(conversationId);
  useEffect(() => {
    activeId.current = conversationId;
    setCoverage(null);
    setSpec(null);
    setError(null);
  }, [conversationId]);

  const loadCoverage = useCallback(async () => {
    if (!isRealConversation(conversationId)) return;
    const requestedFor = conversationId;
    const res = await specApi.getCoverage(conversationId as string);
    if (activeId.current !== requestedFor) return;
    if (res.status === "success" && res.data) setCoverage(res.data);
  }, [conversationId]);

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
    const before = coverage?.filled ?? -1;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (activeId.current !== requestedFor) return;

      const res = await specApi.getCoverage(conversationId as string);
      if (activeId.current !== requestedFor) return;
      if (res.status !== "success" || !res.data) continue;

      setCoverage(res.data);
      if (res.data.filled !== before) return;
    }
  }, [conversationId, coverage?.filled]);

  /** 명세를 만든다. 이미 있으면 대화를 반영한 새 버전을 만든다 */
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
      setError(res.message || "명세를 만들지 못했어요.");
      return null;
    } catch (e) {
      if (activeId.current !== requestedFor) return null;
      setError(e instanceof Error ? e.message : "명세를 만들지 못했어요.");
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
    clearError: () => setError(null),
    refreshCoverage,
    generate,
  };
}
