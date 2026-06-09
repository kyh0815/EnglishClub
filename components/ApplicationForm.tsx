"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { landingContent, levelOptions } from "@/lib/content";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type SubmitState = "idle" | "submitting" | "success";
type TeamStatus = {
  isClosed: boolean;
  status: "모집 중" | "모집 마감";
};

type StatusResponse = {
  ok?: boolean;
  teams?: Record<string, TeamStatus>;
};

export default function ApplicationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [teamStatuses, setTeamStatuses] = useState<Record<string, TeamStatus>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const levelTriggerRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const canSubmit = name.trim().length > 0 && phone.trim().length > 0 && level.trim().length > 0;

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      try {
        const response = await fetch("/api/status", { cache: "no-store" });
        const result = (await response.json()) as StatusResponse;

        if (isMounted && result.ok && result.teams) {
          setTeamStatuses(result.teams);
        }
      } catch {
        if (isMounted) {
          setTeamStatuses({});
        }
      }
    }

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const submittedName = name.trim();
    const submittedPhone = phone.trim();
    const email = String(formData.get("email") ?? "").trim();
    const selectedLevel = level.trim();

    if (!submittedName) {
      nameRef.current?.focus();
      return;
    }

    if (!submittedPhone) {
      phoneRef.current?.focus();
      return;
    }

    if (!selectedLevel) {
      levelTriggerRef.current?.focus();
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: submittedName,
          phone: submittedPhone,
          email,
          level: selectedLevel,
          motivation: String(formData.get("motivation") ?? "").trim(),
          source: landingContent.apply.source,
          website: String(formData.get("website") ?? "").trim()
        })
      });

      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "신청 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.");
      }

      setSubmitState("success");
      window.requestAnimationFrame(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch (submitError) {
      setSubmitState("idle");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "신청 중 문제가 생겼어요. 잠시 후 다시 시도해주세요."
      );
    }
  }

  function getOptionStatus(option: string): TeamStatus | undefined {
    const matchedTeam = landingContent.teams.find((team) => team.levelOption === option);

    if (!matchedTeam) {
      const loadedStatuses = Object.values(teamStatuses);
      const allTeamsClosed =
        loadedStatuses.length === landingContent.teams.length &&
        loadedStatuses.every((team) => team.isClosed);

      return allTeamsClosed ? { isClosed: true, status: "모집 마감" } : undefined;
    }

    return teamStatuses[matchedTeam.englishName];
  }

  if (submitState === "success") {
    return (
      <div className="success show" ref={successRef} role="status" aria-live="polite">
        <div className="mk">✓</div>
        <h3>{landingContent.apply.successTitle}</h3>
        <p>
          {landingContent.apply.successMessageLines[0]}
          <br />
          {landingContent.apply.successMessageLines[1]}
        </p>
      </div>
    );
  }

  return (
    <div id="formView">
      <span className="label rv form-label-center">무료 베타 1기 신청</span>
      <h2 className="rv">지금, 자리를 맡아두세요</h2>
      <p className="lede rv d1">각 6명 한정. 마감 전에 남겨주시면 가장 먼저 연락드릴게요.</p>
      <form id="applyForm" className="rv d1" noValidate onSubmit={handleSubmit}>
        <div className="hp" aria-hidden="true">
          <label htmlFor="website">웹사이트</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field">
          <label htmlFor="name">
            이름 <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="홍길동"
            required
            ref={nameRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="phone">
            전화번호 <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="010-0000-0000"
            required
            ref={phoneRef}
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="email">
            이메일 <span className="opt">(선택)</span>
          </label>
          <input id="email" name="email" type="email" placeholder="you@email.com" autoComplete="email" />
        </div>

        <div className="field">
          <label htmlFor="level">
            영어 레벨 <span className="req" aria-hidden="true">*</span>
          </label>
          <Select value={level} onValueChange={setLevel} name="level">
            <SelectTrigger id="level" ref={levelTriggerRef} aria-required="true">
              <SelectValue placeholder="선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {levelOptions.map((option) => {
                  const optionStatus = getOptionStatus(option);
                  const isClosed = optionStatus?.isClosed ?? false;

                  return (
                    <SelectItem key={option} value={option} disabled={isClosed}>
                      {option}
                      {isClosed ? " (모집 마감)" : ""}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="field">
          <label htmlFor="motive">
            지원 동기 <span className="opt">(한두 줄이면 충분해요)</span>
          </label>
          <textarea
            id="motive"
            name="motivation"
            placeholder="오고 싶은 이유를 짧게 적어주세요."
          />
        </div>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn submit" disabled={submitState === "submitting" || !canSubmit}>
          {submitState === "submitting" ? "신청 중..." : "무료로 신청하기"}
        </button>
        <p className="form-foot">1기는 전액 무료 · 인원 마감 시 조기 종료될 수 있어요.</p>
      </form>
    </div>
  );
}
