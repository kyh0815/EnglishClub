import ApplicationForm from "@/components/ApplicationForm";
import HeroImagePlaceholder from "@/components/HeroImagePlaceholder";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";
import TeamsPanel from "@/components/TeamsPanel";
import { landingContent } from "@/lib/content";

export default function Home() {
  return (
    <>
      <RevealController />
      <Nav />

      <main>
        <section className="hero">
          <HeroImagePlaceholder
            label={landingContent.hero.imagePlaceholder}
            src={landingContent.hero.imageSrc}
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="wrap">
              <span className="label rv">{landingContent.hero.label}</span>
              <h1 className="rv d1">
                {landingContent.hero.titleLines[0]}
                <br />
                {landingContent.hero.titleLines[1]}
              </h1>
              <p className="sub rv d1">
                {landingContent.hero.subtitleLines[0]}
                <br />
                {landingContent.hero.subtitleLines[1]}
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
            <span className="label rv">그냥 수다 모임이 아니에요</span>
            <p className="rv">레슨보다 가볍고, 모임보다 깊게</p>
            <p className="sub rv d1">
              The Round에서 영어는 공부의 대상이 아닙니다.
              <br />
              좋은 사람들과 연결되고, 다시 만나고 싶은 대화를 나누기 위한 언어입니다.
              <br />
              소수 인원, 레벨별 팀, 그리고 대화의 흐름을 이끄는 진행자와 함께 누구나 편하게
              참여할 수 있어요.
            </p>
          </div>
        </section>

        <section className="alt">
          <div className="wrap">
            <span className="label rv">영어 수준은 상관 없어요</span>
            <h2 className="rv">내 레벨에 맞게, 편하게 시작해요</h2>
            <TeamsPanel />
            <p className="teams-note rv">각 팀은 마감되는 대로 다음 기수 대기로 전환돼요.</p>
          </div>
        </section>

        <section className="free">
          <div className="wrap">
            <span className="label rv">왜 무료냐면</span>
            <p className="big rv">1기는 전액 무료로 모십니다.</p>
            <p className="sub rv d1">
              부담 없이 오셔서 영어로 떠들고, The Round의 첫 분위기를 함께 만들어주세요.
            </p>
          </div>
        </section>

        <section id="apply">
          <div className="wrap apply-wrap">
            <ApplicationForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-logo">The Round</div>
              <div className="foot-tag">떠들다 보면, 영어가 트입니다.</div>
            </div>
            <div className="foot-links">
              <a href="#apply">무료 신청</a>
              <span aria-hidden="true">|</span>
              <a href="mailto:hello@theround.club">문의</a>
              <span aria-hidden="true">|</span>
              <a href="#" target="_blank" rel="noopener">
                Instagram
              </a>
            </div>
          </div>
          <div className="foot-copy">© 2026 The Round — English Social Club.</div>
        </div>
      </footer>
    </>
  );
}
