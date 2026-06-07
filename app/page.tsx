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
            <span className="label rv">레슨보다 가볍고, 모임보다 깊게</span>
            <p className="rv">자연스러운 영어는 외워서 만들어지지 않습니다</p>
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
            <div className="difference-head">
              <span className="label rv">{landingContent.difference.label}</span>
              <h2 className="rv d1">{landingContent.difference.title}</h2>
            </div>
            <div className="difference-list">
              {landingContent.difference.items.map((item, index) => (
                <article className={`difference-item rv d${index + 1}`} key={item.name}>
                  <span className="difference-name">{item.name}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
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
