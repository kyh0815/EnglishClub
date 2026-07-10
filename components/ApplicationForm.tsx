"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { applicationDateOptions, cohortOptions, landingContent, levelOptions } from "@/lib/content";
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
  status: "모집 중" | "모집 마감" | "준비중" | "사전예약";
};

type StatusResponse = {
  ok?: boolean;
  teams?: Record<string, TeamStatus>;
};

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isClosed: boolean;
};

const APPLICATION_DEADLINE = new Date("2026-07-31T23:59:59+09:00").getTime();
const genderOptions = ["남자", "여자", "Others"] as const;
const opicScoreOptions = ["없음", "IL", "IM", "IH", "AL"] as const;
const toeicSpeakingScoreOptions = [
  "없음",
  "레벨 4 (NH~IL)",
  "레벨 5 (IM)",
  "레벨 6 (IH)",
  "레벨 7 (AM~AL)",
  "레벨 8 (AH)"
] as const;
const overseasExperienceOptions = ["없음", "1~2년", "3년 이상"] as const;
const internationalSchoolOptions = ["없음", "있음"] as const;

function getCountdownValue(): CountdownValue {
  const remaining = APPLICATION_DEADLINE - Date.now();
  const safeRemaining = Math.max(remaining, 0);

  return {
    days: Math.floor(safeRemaining / 86_400_000),
    hours: Math.floor((safeRemaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((safeRemaining % 3_600_000) / 60_000),
    seconds: Math.floor((safeRemaining % 60_000) / 1000),
    isClosed: remaining <= 0
  };
}

function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

function getInitialCohort(): string {
  if (typeof window === "undefined") {
    return landingContent.apply.defaultCohort;
  }

  const params = new URLSearchParams(window.location.search);
  const queryCohort = params.get("cohort")?.trim();

  return queryCohort && cohortOptions.includes(queryCohort as (typeof cohortOptions)[number])
    ? queryCohort
    : landingContent.apply.defaultCohort;
}

export default function ApplicationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [teamStatuses, setTeamStatuses] = useState<Record<string, TeamStatus>>({});
  const [countdown, setCountdown] = useState<CountdownValue>(() => getCountdownValue());
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [cohort, setCohort] = useState<string>(() => getInitialCohort());
  const [applicationDate, setApplicationDate] = useState("");
  const [level, setLevel] = useState("");
  const [opicScore, setOpicScore] = useState("없음");
  const [toeicSpeakingScore, setToeicSpeakingScore] = useState("없음");
  const [overseasExperience, setOverseasExperience] = useState("");
  const [internationalSchool, setInternationalSchool] = useState("");
  const [isLevelGuideOpen, setIsLevelGuideOpen] = useState(false);
  const [venueConfirmed, setVenueConfirmed] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cohortGroupRef = useRef<HTMLFieldSetElement>(null);
  const genderGroupRef = useRef<HTMLFieldSetElement>(null);
  const applicationDateGroupRef = useRef<HTMLFieldSetElement>(null);
  const levelGroupRef = useRef<HTMLFieldSetElement>(null);
  const overseasGroupRef = useRef<HTMLFieldSetElement>(null);
  const internationalSchoolGroupRef = useRef<HTMLFieldSetElement>(null);
  const venueConfirmationRef = useRef<HTMLFieldSetElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const canSubmit =
    name.trim().length > 0 &&
    gender.trim().length > 0 &&
    phone.trim().length > 0 &&
    cohort.trim().length > 0 &&
    applicationDate.trim().length > 0 &&
    level.trim().length > 0 &&
    overseasExperience.trim().length > 0 &&
    internationalSchool.trim().length > 0 &&
    venueConfirmed;

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownValue());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const submittedName = name.trim();
    const selectedGender = gender.trim();
    const submittedPhone = phone.trim();
    const email = String(formData.get("email") ?? "").trim();
    const selectedCohort = cohort.trim();
    const selectedApplicationDate = applicationDate.trim();
    const selectedLevel = level.trim();
    const selectedOverseasExperience = overseasExperience.trim();
    const selectedInternationalSchool = internationalSchool.trim();

    if (!submittedName) {
      nameRef.current?.focus();
      return;
    }

    if (!selectedGender) {
      genderGroupRef.current?.focus();
      return;
    }

    if (!submittedPhone) {
      phoneRef.current?.focus();
      return;
    }

    if (!selectedCohort) {
      cohortGroupRef.current?.focus();
      return;
    }

    if (!selectedApplicationDate) {
      applicationDateGroupRef.current?.focus();
      return;
    }

    if (!selectedLevel) {
      levelGroupRef.current?.focus();
      return;
    }

    if (!selectedOverseasExperience) {
      overseasGroupRef.current?.focus();
      return;
    }

    if (!selectedInternationalSchool) {
      internationalSchoolGroupRef.current?.focus();
      return;
    }

    if (!venueConfirmed) {
      venueConfirmationRef.current?.focus();
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
          gender: selectedGender,
          phone: submittedPhone,
          email,
          cohort: selectedCohort,
          applicationDate: selectedApplicationDate,
          level: selectedLevel,
          opicScore,
          toeicSpeakingScore,
          overseasExperience: selectedOverseasExperience,
          internationalSchool: selectedInternationalSchool,
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
      return undefined;
    }

    const matchedTeamStatus = matchedTeam.status as TeamStatus["status"];

    return (
      teamStatuses[matchedTeam.englishName] ?? {
        isClosed: matchedTeamStatus === "준비중",
        status: matchedTeamStatus
      }
    );
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
      <div className="form-intro">
        <span className="label rv form-label-center apply-eyebrow" aria-live="polite">
          {cohort} 신청
          <span className="apply-deadline">
            {countdown.isClosed
              ? "모집 마감"
              : `D-${countdown.days} ${twoDigits(countdown.hours)}:${twoDigits(
                  countdown.minutes
                )}:${twoDigits(countdown.seconds)} 후 마감`}
          </span>
        </span>
        <h2 className="rv">지금, 자리를 맡아두세요</h2>
        <p className="lede rv d1">
          현재는 중급·고급 각 6명을 모집하고 있어요.
          <br />
          마감 전에 남겨주시면 가장 먼저 연락드릴게요.
        </p>
        <p className="apply-note rv d1">* 초급 선택 시, 자동으로 사전 예약 명단에 올라가요.</p>
      </div>

      <form id="applyForm" className="application-form rv d1" noValidate onSubmit={handleSubmit}>
        <div className="hp" aria-hidden="true">
          <label htmlFor="website">웹사이트</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <p className="form-balance-note">그룹 밸런스와 레벨 배정을 위해 여쭤봐요.</p>

        <fieldset className="field choice-field" ref={cohortGroupRef} tabIndex={-1}>
          <legend>
            신청 기수 <span className="req" aria-hidden="true">*</span>
          </legend>
          <div className="choice-grid choice-grid-2">
            {cohortOptions.map((option) => (
              <label className="choice-card cohort-card" key={option}>
                <input
                  type="radio"
                  name="cohort"
                  value={option}
                  checked={cohort === option}
                  onChange={(event) => setCohort(event.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-row">
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

          <fieldset className="field choice-field" ref={genderGroupRef} tabIndex={-1}>
            <legend>
              성별 <span className="req" aria-hidden="true">*</span>
            </legend>
            <div className="choice-grid choice-grid-3">
              {genderOptions.map((option) => (
                <label className="choice-card" key={option}>
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={gender === option}
                    onChange={(event) => setGender(event.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="form-row">
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
        </div>

        <fieldset className="field choice-field" ref={applicationDateGroupRef} tabIndex={-1}>
          <legend>
            수업 가능 일자 <span className="req" aria-hidden="true">*</span>
          </legend>
          <div className="choice-grid choice-grid-2">
            {applicationDateOptions.map((option) => (
              <label className="choice-card date-card" key={option}>
                <input
                  type="radio"
                  name="applicationDate"
                  value={option}
                  checked={applicationDate === option}
                  onChange={(event) => setApplicationDate(event.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-section">
          <div className="field">
            <div className="level-label-row">
              <label>
                영어 레벨 (자가진단) <span className="req" aria-hidden="true">*</span>
              </label>
              <button
                className="level-guide-toggle"
                type="button"
                aria-controls="level-self-check-panel"
                aria-expanded={isLevelGuideOpen}
                onClick={() => setIsLevelGuideOpen((current) => !current)}
              >
                내 레벨을 모르겠다면?
                <ChevronDown className="level-guide-toggle-icon" aria-hidden="true" />
              </button>
            </div>
            <p className="field-helper">참고용이에요. 최종 배정은 레벨 체크 콜 후 안내드려요.</p>
            <fieldset
              className="choice-field choice-field-inner"
              ref={levelGroupRef}
              tabIndex={-1}
              aria-label="영어 레벨"
            >
              <div className="choice-grid choice-grid-3">
                {levelOptions.map((option) => {
                  const optionStatus = getOptionStatus(option);
                  const isClosed = optionStatus?.isClosed ?? false;

                  return (
                    <label className="choice-card level-card" data-disabled={isClosed || undefined} key={option}>
                      <input
                        type="radio"
                        name="level"
                        value={option}
                        disabled={isClosed}
                        checked={level === option}
                        onChange={(event) => setLevel(event.target.value)}
                      />
                      <span>{option}</span>
                      {optionStatus?.status === "사전예약" || isClosed ? (
                        <small>{optionStatus?.status ?? "준비중"}</small>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div
              className="level-guide-panel"
              data-open={isLevelGuideOpen || undefined}
              id="level-self-check-panel"
              aria-hidden={!isLevelGuideOpen}
            >
              <div className="level-self-check-head">
                <p>
                  공통 질문: <strong>{landingContent.levelSelfCheck.question}</strong>
                </p>
              </div>
              <div className="level-self-check-table" aria-label="영어 레벨 자가진단 기준">
                <div className="level-self-check-row level-self-check-header">
                  <span>레벨</span>
                  <span>이렇게 말할 수 있다면</span>
                  <span>예시 답변</span>
                </div>
                {landingContent.levelSelfCheck.levels.map((item) => (
                  <button
                    className="level-self-check-row level-self-check-option"
                    data-selected={level === item.name || undefined}
                    disabled={!isLevelGuideOpen}
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setLevel(item.name);
                      setIsLevelGuideOpen(false);
                    }}
                  >
                    <span>
                      <strong>{item.name}</strong>
                      {"status" in item ? <em>{item.status}</em> : null}
                    </span>
                    <span>{item.canDo}</span>
                    <span>{item.example}</span>
                  </button>
                ))}
              </div>
              <p className="level-self-check-helper">{landingContent.levelSelfCheck.helper}</p>
            </div>
          </div>

          <fieldset className="field choice-field speaking-score-field">
            <legend>영어 회화 점수</legend>
            <div className="form-row speaking-score-row">
              <div className="field">
                <label htmlFor="opicScore">
                  오픽 <span className="opt">(선택)</span>
                </label>
                <Select name="opicScore" value={opicScore} onValueChange={setOpicScore}>
                  <SelectTrigger id="opicScore">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {opicScoreOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="field">
                <label htmlFor="toeicSpeakingScore">
                  토익스피킹 <span className="opt">(선택)</span>
                </label>
                <Select
                  name="toeicSpeakingScore"
                  value={toeicSpeakingScore}
                  onValueChange={setToeicSpeakingScore}
                >
                  <SelectTrigger id="toeicSpeakingScore">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {toeicSpeakingScoreOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <fieldset className="field choice-field" ref={overseasGroupRef} tabIndex={-1}>
            <legend>
              영어권 해외 거주 경험 <span className="req" aria-hidden="true">*</span>
            </legend>
            <div className="choice-grid choice-grid-3">
              {overseasExperienceOptions.map((option) => (
                <label className="choice-card" key={option}>
                  <input
                    type="radio"
                    name="overseasExperience"
                    value={option}
                    checked={overseasExperience === option}
                    onChange={(event) => setOverseasExperience(event.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field choice-field" ref={internationalSchoolGroupRef} tabIndex={-1}>
            <legend>
              국제 학교 경험 <span className="req" aria-hidden="true">*</span>
            </legend>
            <div className="choice-grid choice-grid-2">
              {internationalSchoolOptions.map((option) => (
                <label className="choice-card" key={option}>
                  <input
                    type="radio"
                    name="internationalSchool"
                    value={option}
                    checked={internationalSchool === option}
                    onChange={(event) => setInternationalSchool(event.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field choice-field" ref={venueConfirmationRef} tabIndex={-1}>
            <legend>
              세션 장소 확인 <span className="req" aria-hidden="true">*</span>
            </legend>
            <label className="choice-card venue-confirmation-card">
              <input
                type="checkbox"
                name="venueConfirmed"
                checked={venueConfirmed}
                onChange={(event) => setVenueConfirmed(event.target.checked)}
              />
              <span>
                {landingContent.serviceInfo.venueAddress}
                <small>확인했어요</small>
              </span>
            </label>
          </fieldset>
        </div>

        <div className="field">
          <label htmlFor="motive">
            신청 사유
          </label>
          <textarea
            id="motive"
            name="motivation"
            placeholder="The Round에서 함께하고 싶은 이유를 간략하게 적어주세요."
          />
        </div>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn submit" disabled={submitState === "submitting" || !canSubmit}>
          {submitState === "submitting" ? "신청 중..." : "1기 신청하기"}
        </button>
        <p className="form-foot">
          1기는 한 달 무료, 노쇼 방지 보증금은 정상 참여 시 전액 환급해드려요.
        </p>
      </form>
    </div>
  );
}
