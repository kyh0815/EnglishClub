import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";

export const metadata: Metadata = {
  title: "Who we are — The Round",
  description: "The Round가 영어를 자연스러운 일상으로 만들고 싶은 이유"
};

const missionParagraphs = [
  "우리는 오랫동안 영어를 배워왔습니다.",
  "학교에서, 학원에서, 시험을 위해 수많은 문장을 외우고 문제를 풀었습니다.",
  "그런데 막상 영어로 말해야 하는 순간이 오면, 많은 사람들은 여전히 망설입니다.",
  "실력이 부족해서가 아닙니다. 영어를 대화의 언어가 아니라 공부의 대상으로만 배워왔기 때문입니다.",
  "The Round는 영어를 다시 바라보는 방식에서 시작했습니다. 영어는 외워야 하는 과목이 아니라, 사람과 연결되고 생각을 나누는 수단이어야 합니다.",
  "그래서 우리는 일상 속에 부족했던 기회를 만듭니다. 영어로만 생각하고, 영어로 표현하고, 영어로 대화하는 시간.",
  "어색해도 계속 말해보고, 서로의 이야기를 들으며, 자연스럽게 영어와 가까워지는 자리.",
  "The Round는 영어가 특별한 일이 아니라, 조금씩 내 일상에 스며드는 경험을 만들어갑니다.",
  "여러분들의 영어를 연결의 도구로 만들어 보세요. 영감을 주는 동료들과 네트워크를 쌓고, 더 넓은 세상에서 더 큰 기회의 문을 열어보세요."
];

const founderComment = {
  heading: "The Round는 영어를 '공부'가 아니라 '대화'로 만나는 곳입니다.",
  paragraphs: [
    "제 동생은 영어권에서 산 적도, 국제학교나 외고를 다닌 적도 없지만 지금은 영어를 준원어민 수준으로 구사합니다. 특별한 학습법이 있었던 건 아니에요. 비결은 오히려 단순했습니다. 동생과 저는 함께 있을 때면 일부러 영어로 대화하곤 했어요. 영어는 학교에서 배우는 학문이기도 했지만, 저희에겐 그냥 재밌는 대화 수단이었거든요.",
    "그러면서 알게 됐어요. 영어로 말하고, 영어로 생각하려 애쓰고, 일단 한 마디라도 입 밖으로 꺼내보는 것. 그 시간이 쌓이면 영어는 책상 앞에서 외울 때와는 다르게 트인다는 걸요.",
    "The Round는 그 경험을 함께 나누기 위해 만들어졌습니다. 둥근 테이블에 둘러앉아, 완벽하지 않아도 편하게 영어로 말해보는 곳. 그렇게 영어가 시험이 아니라 대화가 되는 순간을, 함께 만들어가고자 합니다."
  ]
};

const partnerComment = {
  heading: "누구나 입을 뗄 수 있어요.",
  paragraphs: [
    "10년 동안 영어 과외와 학원에서 학생들을 가르쳤어요. 그러면서 늘 마음에 남던 친구들이 있어요. 아무리 열심히 공부해도 정작 입은 떼지 못하던 친구들이요.",
    "그런데 신기한 일이 벌어지곤 했어요. 그 친구들에게 자신감을 불어넣고 일단 말을 하게 하면, 어느 순간 정말 잘하게 되더라고요. 입이 트이니 자신감이 붙고, 자신감이 붙으니 영어를 좋아하게 되고요. 부족했던 건 실력이 아니라, 편하게 말해볼 자리였던 거예요.",
    "저는 그 순간을 더 많이 보고 싶어요. 그래서 The Round를 함께 시작했습니다. 마음 편히 입을 떼고, 영어로 사람을 만나고, 다양한 사람들과 대화하며 관계를 넓혀가는 곳. 영어가 공부를 넘어 사람과 사람을 잇는 도구가 되는 모습을, 여기서 함께 보고 싶어요."
  ]
};

export default function WhoWeArePage() {
  return (
    <>
      <RevealController />
      <Nav transparentOnTop />

      <main className="about-page">
        <section className="about-hero" aria-labelledby="about-hero-title">
          <Image
            src="/images/the-round-about-hero.png"
            alt="따뜻한 햇살이 들어오는 공간의 둥근 테이블"
            fill
            priority
            sizes="100vw"
            className="about-hero-image"
          />
          <div className="about-hero-shade" />
          <div className="wrap about-hero-copy">
            <h1 id="about-hero-title" className="rv d1">
              About The Round
            </h1>
          </div>
        </section>

        <section className="about-statement" aria-labelledby="about-statement-title">
          <div className="wrap about-statement-grid">
            <span className="about-kicker about-statement-kicker rv">Our Mission</span>
            <div className="about-mission-copy">
              <h2 id="about-statement-title" className="rv d1">
                영어가 자연스러운 일상이 될 수 있도록
              </h2>
              <div className="about-mission-body rv d2">
                {missionParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-founder" aria-labelledby="founder-section-title">
          <div className="wrap about-section-heading">
            <span className="about-kicker about-section-kicker rv">Our Story</span>
            <h2 id="founder-section-title" className="rv d1">
              우리가 The Round를 시작한 이유
            </h2>
          </div>
          <div className="wrap about-founder-wrap">
            <div className="about-founder-image rv">
              <Image
                src="/images/founder-jk.png"
                alt="The Round partner illustration"
                fill
                sizes="(max-width: 760px) 100vw, 48vw"
                className="about-founder-portrait"
              />
              <span className="about-founder-name-tag">Kweon Park</span>
            </div>
            <blockquote className="about-founder-comment rv d1">
              <h3>{founderComment.heading}</h3>
              <div className="about-founder-comment-body">
                {partnerComment.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </blockquote>
          </div>
          <div className="wrap about-founder-wrap about-founder-wrap-secondary">
            <blockquote className="about-founder-comment about-founder-comment-reverse rv d1">
              <h3>{partnerComment.heading}</h3>
              <div className="about-founder-comment-body">
                {founderComment.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </blockquote>
            <div className="about-founder-image rv">
              <Image
                src="/images/founder-yh.png"
                alt="The Round founder illustration"
                fill
                sizes="(max-width: 760px) 100vw, 34vw"
                className="about-founder-portrait"
              />
              <span className="about-founder-name-tag">Ian Kim</span>
            </div>
          </div>
        </section>

        <section className="about-cta" aria-labelledby="about-cta-title">
          <div className="wrap about-cta-wrap rv">
            <span className="label">Join The Round</span>
            <h2 id="about-cta-title">영어가 자연스러워지는 첫 테이블에 함께하세요</h2>
            <p>1기는 The Round의 첫 분위기를 함께 만들어갈 멤버를 모시는 자리입니다.</p>
            <Link href="/apply" className="btn">
              1기 신청하기
            </Link>
          </div>
        </section>
      </main>

      <Footer applyHref="/apply" inquiryHref="/inquiry" />
    </>
  );
}
