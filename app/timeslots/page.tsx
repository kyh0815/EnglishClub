import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";
import TimeslotSelector from "@/components/TimeslotSelector";

export default function TimeslotsPage() {
  return (
    <>
      <RevealController />
      <Nav />

      <main>
        <section className="subpage timeslots-page">
          <div className="wrap subpage-wrap">
            <span className="label rv">Timeslots</span>
            <h1 className="rv">참여 가능한 시간을 골라주세요</h1>
            <p className="lede rv d1">
              정식 신청과 연결되기 전 UI 확인용 선택 화면입니다. 가능한 시간대를 여러 개 선택할
              수 있습니다.
            </p>
            <TimeslotSelector />
          </div>
        </section>
      </main>

      <Footer applyHref="/apply" inquiryHref="/inquiry" />
    </>
  );
}
