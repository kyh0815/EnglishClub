import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import HeroImagePlaceholder from "@/components/HeroImagePlaceholder";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";
import { landingContent } from "@/lib/content";
import Image from "next/image";
import type { CSSProperties } from "react";

const introducingIcons = [
  "/images/icons/introducing-cohort-3d.svg",
  "/images/icons/introducing-feedback-3d.svg",
  "/images/icons/introducing-mc-3d.svg"
] as const;

export default function Home() {
  const expectationItems = landingContent.expectations.items;
  const expectationBufferItems = expectationItems.slice(-2);
  const expectationLoopItems = [...expectationBufferItems, ...expectationItems, ...expectationItems];
  const expectationStepSeconds = 1.6;
  const expectationFocusLeadSeconds = 0.22;
  const expectationBufferSize = expectationBufferItems.length;
  const expectationLastFocusIndex = expectationBufferSize + expectationItems.length;

  return (
    <>
      <RevealController />
      <Nav />

      <main className="home-main">
        <section className="hero">
          <HeroImagePlaceholder
            label={landingContent.hero.imagePlaceholder}
            src={landingContent.hero.imageSrc}
            videoSrc={landingContent.hero.videoSrc}
            videoSources={landingContent.hero.videoSources}
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="wrap">
              <span className="label rv">{landingContent.hero.label}</span>
              <h1 className="hero-title rv d1">
                {landingContent.hero.titleLines.join(" ")}
              </h1>
              <p className="sub rv d1">
                {landingContent.hero.subtitleLines[0]}
                <br />
                <span className="hero-tagline">{landingContent.hero.subtitleLines[1]}</span>
              </p>
              <div className="actions rv d1">
                <a href="#apply" className="btn">
                  {landingContent.hero.cta}
                </a>
                <span className="note">{landingContent.hero.note}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="what">
          <div className="wrap">
            <p className="what-statement rv">
              <strong>
                자연스러운 영어는 외워서 만들어지지 않습니다. 외운 문장보다 좋은 대화 속에서 더
                오래 남아요.
              </strong>{" "}
              <span>
                The Round에서는 실제 표현과 대화의 흐름을 경험하며, 자연스러운 영어를 내
                것으로 만들어갑니다.
              </span>
            </p>
          </div>
        </section>

        <section className="introducing" aria-labelledby="introducing-title">
          <div className="wrap introducing-wrap">
            <div className="introducing-panel rv d1">
              <div className="introducing-head">
                <h2 id="introducing-title">{landingContent.introducing.headline}</h2>
                <p>{landingContent.introducing.caption}</p>
              </div>
              <div className="introducing-grid">
                {landingContent.introducing.steps.map((step, index) => {
                  const iconSrc = introducingIcons[index] ?? introducingIcons[0];

                  return (
                    <article className={`introducing-card d${index + 1}`} key={step.name}>
                      <span className="introducing-icon-box" aria-hidden="true">
                        <Image
                          className="introducing-icon"
                          src={iconSrc}
                          alt=""
                          width={84}
                          height={84}
                          unoptimized
                        />
                      </span>
                      <h3>{step.name}</h3>
                      <p>{step.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        <section className="expectations" aria-labelledby="expectations-title">
          <div className="wrap expectations-wrap">
            <h2 id="expectations-title" className="sr-only">
              {landingContent.expectations.headline}
            </h2>
            <div className="expectations-phrase rv d1">
              <span className="expectations-prefix">{landingContent.expectations.headline}</span>
              <div className="expectations-loop">
                <ul className="expectations-list">
                  {expectationLoopItems.map((item, index) => {
                    const focusIndex = index - expectationBufferSize;
                    const shouldFocus =
                      index >= expectationBufferSize && index <= expectationLastFocusIndex;
                    const focusDelay = shouldFocus
                      ? Math.max(focusIndex * expectationStepSeconds - expectationFocusLeadSeconds, 0)
                      : 0;

                    return (
                      <li
                        key={`${item}-${index}`}
                        className={shouldFocus ? undefined : "is-buffer"}
                        style={{ "--focus-delay": `${focusDelay}s` } as CSSProperties}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <ul className="sr-only">
              {landingContent.expectations.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pricing" aria-labelledby="pricing-title">
          <div className="wrap pricing-wrap">
            <span className="label rv">{landingContent.pricing.eyebrow}</span>
            <h2 id="pricing-title" className="pricing-title rv d1">
              {landingContent.pricing.headline}
            </h2>
            <p className="pricing-message rv d1">{landingContent.pricing.message}</p>
            <div className="membership-benefits rv d1">
              {landingContent.pricing.benefits.map((benefit) => (
                <article className="membership-benefit-card" key={benefit.name}>
                  <h3>{benefit.name}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="apply">
          <div className="wrap apply-wrap">
            <ApplicationForm />
          </div>
        </section>

        <FAQSection />

        <section className="ending" aria-labelledby="ending-title">
          <div className="wrap ending-wrap">
            <div className="ending-card rv">
              <div className="ending-copy">
                <h2 id="ending-title">
                  영어가 더 이상 학습의 대상이 아닌
                  <br />
                  연결의 수단이 될 수 있도록
                </h2>
                <p className="ending-statement">The Round에서 그 변화를 함께 시작해요</p>
                <div className="ending-actions">
                  <a href="#apply" className="ending-cta">
                    무료 1기 신청하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
