import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";

export default function WhoWeArePage() {
  return (
    <>
      <RevealController />
      <Nav />

      <main>
        <section className="subpage">
          <div className="wrap subpage-wrap">
            <span className="label rv">Who we are</span>
            <h1 className="rv">The Round를 만드는 사람들</h1>
            <p className="lede rv d1">
              이 페이지에는 The Round의 시작점, 운영 방식, 함께 만드는 사람들의 이야기를
              차차 채워둘 예정입니다.
            </p>
          </div>
        </section>
      </main>

      <Footer applyHref="/apply" inquiryHref="/inquiry" />
    </>
  );
}
