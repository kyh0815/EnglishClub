import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import HeroImagePlaceholder from "@/components/HeroImagePlaceholder";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";
import { landingContent } from "@/lib/content";
import { BarChart3, CalendarDays, ClipboardList, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";

const introducingIcons = [
  "/images/icons/introducing-calendar-3d.png",
  "/images/icons/introducing-chat-3d.png",
  "/images/icons/introducing-mic-3d.png"
] as const;

const membershipBenefitIcons = [
  CalendarDays,
  MessageCircleMore,
  ClipboardList,
  BarChart3
] as const;

type FeatureVisualId = (typeof landingContent.featureBlocks)[number]["id"];

function FeatureVisual({ id }: { id: FeatureVisualId }) {
  if (id === "conversation") {
    return (
      <div className="feature-visual-collage feature-visual-conversation" aria-hidden="true">
        <div className="feature-float-card topic-card topic-card-1 is-delay-1">
          <span>Topic 01</span>
          <strong>The Best Part of My Day</strong>
          <small>Warm-up</small>
        </div>
        <div className="feature-float-card topic-card topic-card-2 is-delay-2">
          <span>Topic 02</span>
          <strong>Who Am I in Three Words?</strong>
          <small>Table talk</small>
        </div>
        <div className="feature-float-card topic-card topic-card-3 is-delay-3">
          <span>Topic 03</span>
          <strong>My Current Obsession</strong>
          <small>Deep dive</small>
        </div>
      </div>
    );
  }

  if (id === "level") {
    return (
      <div className="feature-visual-collage feature-visual-level" aria-hidden="true">
        <div className="feature-float-card level-call-chip is-delay-1">
          <span>10 min</span>
          <strong>Level Check Call</strong>
        </div>
        <div className="feature-float-card level-card-main is-delay-2">
          <span className="feature-pill">Matching system</span>
          <h4>Table Match</h4>
          <div className="level-table-list">
            <div>
              <span>Intermediate</span>
              <strong>Table A</strong>
              <small>comfortable pace</small>
            </div>
            <div>
              <span>Advanced</span>
              <strong>Table B</strong>
              <small>deeper flow</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-visual-collage feature-visual-feedback" aria-hidden="true">
      <div className="feature-float-card recap-message-card is-delay-1">
        <div className="recap-card-head">
          <span>Session Recap</span>
          <small>after class</small>
        </div>
        <h4>오늘의 좋은 표현</h4>
        <p>“That makes sense.”를 더 자연스럽게 이어 말해봤어요.</p>
        <ul>
          <li>Good expression</li>
          <li>Speaking point</li>
        </ul>
      </div>
      <div className="feature-float-card monthly-report-card is-delay-2">
        <div className="report-card-head">
          <span>Monthly Report</span>
        </div>
        <h4>Monthly Feedback</h4>
        <div className="report-radar">
          <div className="report-radar-visual">
            <svg viewBox="0 0 220 220">
              <polygon className="radar-grid" points="110,18 190,64 190,156 110,202 30,156 30,64" />
              <polygon className="radar-grid" points="110,48 164,79 164,141 110,172 56,141 56,79" />
              <polygon className="radar-grid" points="110,78 138,94 138,126 110,142 82,126 82,94" />
              <line className="radar-spoke" x1="110" y1="110" x2="110" y2="18" />
              <line className="radar-spoke" x1="110" y1="110" x2="190" y2="64" />
              <line className="radar-spoke" x1="110" y1="110" x2="190" y2="156" />
              <line className="radar-spoke" x1="110" y1="110" x2="110" y2="202" />
              <line className="radar-spoke" x1="110" y1="110" x2="30" y2="156" />
              <line className="radar-spoke" x1="110" y1="110" x2="30" y2="64" />
              <polygon className="radar-score" points="110,42 166,78 151,134 110,154 74,131 64,83" />
              <circle className="radar-point" cx="110" cy="42" r="3" />
              <circle className="radar-point" cx="166" cy="78" r="3" />
              <circle className="radar-point" cx="151" cy="134" r="3" />
              <circle className="radar-point" cx="110" cy="154" r="3" />
              <circle className="radar-point" cx="74" cy="131" r="3" />
              <circle className="radar-point" cx="64" cy="83" r="3" />
            </svg>
          </div>
          <div className="report-insights">
            <div>
              <span className="report-skeleton report-skeleton-kicker" />
              <span className="report-skeleton report-skeleton-line" />
            </div>
            <div>
              <span className="report-skeleton report-skeleton-kicker" />
              <span className="report-skeleton report-skeleton-line is-short" />
            </div>
            <div>
              <span className="report-skeleton report-skeleton-kicker" />
              <span className="report-skeleton report-skeleton-pill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
                          width={72}
                          height={72}
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

        <section className="feature-zigzag" aria-label="The Round 핵심 경험">
          <div className="wrap feature-zigzag-wrap">
            {landingContent.featureBlocks.map((block, index) => (
              <article
                className={`feature-block${index % 2 === 1 ? " is-reverse" : ""}`}
                key={block.id}
              >
                <div className="feature-copy rv">
                  <h2>{block.headline}</h2>
                  <p>
                    {block.body.map((part, partIndex) =>
                      "strong" in part && part.strong ? (
                        <strong key={`${block.id}-${partIndex}`}>{part.text}</strong>
                      ) : (
                        <span key={`${block.id}-${partIndex}`}>{part.text}</span>
                      )
                    )}
                  </p>
                  {"link" in block ? (
                    <a className="feature-link" href={block.link.href}>
                      {block.link.label} <span aria-hidden="true">→</span>
                    </a>
                  ) : null}
                </div>
                <div className="feature-visual-panel rv d1">
                  <FeatureVisual id={block.id} />
                </div>
              </article>
            ))}
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
            <div className="pricing-venue rv d1" aria-label={landingContent.pricing.venueLabel}>
              <span className="pricing-venue-label">{landingContent.pricing.venueLabel}</span>
              <span className="pricing-venue-address">
                <span aria-hidden="true">📍</span>
                {landingContent.pricing.venueAddress}
              </span>
              <p className="pricing-venue-note">* {landingContent.pricing.depositNote}</p>
            </div>
            <div className="membership-benefits rv d1">
              {landingContent.pricing.benefits.map((benefit, index) => {
                const BenefitIcon = membershipBenefitIcons[index] ?? ClipboardList;

                return (
                  <article className="membership-benefit-card" key={benefit.name}>
                    <span className="membership-benefit-icon" aria-hidden="true">
                      <BenefitIcon size={24} strokeWidth={1.8} />
                    </span>
                    <div className="membership-benefit-copy">
                      <h3>{benefit.name}</h3>
                      <p>{benefit.description}</p>
                    </div>
                  </article>
                );
              })}
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
