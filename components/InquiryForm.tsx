"use client";

import { FormEvent, useRef, useState } from "react";
import { landingContent } from "@/lib/content";

type SubmitState = "idle" | "submitting" | "success";

export default function InquiryForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const canSubmit =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    message.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const submittedName = name.trim();
    const submittedPhone = phone.trim();
    const submittedEmail = email.trim();
    const submittedMessage = message.trim();

    if (!submittedName) {
      nameRef.current?.focus();
      return;
    }

    if (!submittedPhone) {
      phoneRef.current?.focus();
      return;
    }

    if (!submittedMessage) {
      messageRef.current?.focus();
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: submittedName,
          phone: submittedPhone,
          email: submittedEmail,
          message: submittedMessage,
          website: String(formData.get("website") ?? "").trim()
        })
      });

      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "문의 접수 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.");
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
          : "문의 접수 중 문제가 생겼어요. 잠시 후 다시 시도해주세요."
      );
    }
  }

  if (submitState === "success") {
    return (
      <div className="success show" ref={successRef} role="status" aria-live="polite">
        <div className="mk">✓</div>
        <h3>{landingContent.inquiry.successTitle}</h3>
        <p>
          {landingContent.inquiry.successMessageLines[0]}
          <br />
          {landingContent.inquiry.successMessageLines[1]}
        </p>
      </div>
    );
  }

  return (
    <form className="rv d1" noValidate onSubmit={handleSubmit}>
      <div className="hp" aria-hidden="true">
        <label htmlFor="inquiry-website">웹사이트</label>
        <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label htmlFor="inquiry-name">
          이름 <span className="req" aria-hidden="true">*</span>
        </label>
        <input
          id="inquiry-name"
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
        <label htmlFor="inquiry-phone">
          휴대폰번호 <span className="req" aria-hidden="true">*</span>
        </label>
        <input
          id="inquiry-phone"
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
        <label htmlFor="inquiry-email">
          이메일 <span className="opt">(선택)</span>
        </label>
        <input
          id="inquiry-email"
          name="email"
          type="email"
          placeholder="you@email.com"
          ref={emailRef}
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="inquiry-message">
          문의사항 <span className="req" aria-hidden="true">*</span>
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          placeholder="궁금한 점을 남겨주세요."
          required
          ref={messageRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn submit" disabled={submitState === "submitting" || !canSubmit}>
        {submitState === "submitting" ? "접수 중..." : "문의 남기기"}
      </button>
      <p className="form-foot">레벨, 일정, 장소 등 편하게 남겨주세요.</p>
    </form>
  );
}
