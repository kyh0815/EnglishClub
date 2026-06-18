import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import HeroImagePlaceholder from "@/components/HeroImagePlaceholder";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";
import TypingText from "@/components/TypingText";
import { landingContent } from "@/lib/content";
import { ClipboardList, Map, Sparkles } from "lucide-react";

const differenceIcons = [Map, ClipboardList, Sparkles] as const;

export default function Home() {
  return (
    <>
      <RevealController />
      <Nav />

      <main className="home-main">
        <section className="hero">
          <HeroImagePlaceholder
            label={landingContent.hero.imagePlaceholder}
            src={landingContent.hero.imageSrc}
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="wrap">
              <span className="label rv">{landingContent.hero.label}</span>
              <h1 className="hero-title rv d1">
                {landingContent.hero.titleLines[0]}
                <br />
                {landingContent.hero.titleLines[1]}
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
            <p className="what-title rv">
              <TypingText text="자연스러운 영어는 외워서 만들어지지 않습니다." />
            </p>
            <p className="sub rv d1">
              영어는 책상 앞에서 외운 문장보다, 좋은 대화 속에서 더 오래 남습니다.
              <br />
              The Round에서는 영어를 말하는 자신감을 키우는 것에서 끝나지 않아요.
              <br />
              실제로 쓰이는 표현과 대화의 흐름을 경험하며, 영어를 조금씩{" "}
              <span className="keep-together">내 것으로 만들어갑니다.</span>
            </p>
          </div>
        </section>

        <section className="difference">
          <div className="wrap difference-wrap">
            <div className="difference-list">
              {landingContent.difference.items.map((item, index) => {
                const Icon = differenceIcons[index] ?? Map;

                return (
                  <article className={`difference-item rv d${index + 1}`} key={item.name}>
                    <span className="difference-icon-box" aria-hidden="true">
                      <Icon className="difference-icon" />
                    </span>
                    <div className="difference-copy">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="free">
          <div className="wrap">
            <span className="label rv">비용이 궁금하신가요?</span>
            <p className="big rv">1기는 한 달간 전액 무료로 모십니다.</p>
            <p className="sub rv d1">
              부담 없이 오셔서 영어로 떠들고, The Round의 첫 분위기를
              <br />
              함께 만들어주세요.
            </p>
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
