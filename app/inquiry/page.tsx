import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";

export default function InquiryPage() {
  return (
    <>
      <RevealController />
      <Nav />

      <main>
        <section className="inquiry-page">
          <div className="wrap inquiry-wrap">
            <span className="label rv form-label-center">문의</span>
            <h1 className="rv">궁금한 점이 있나요?</h1>
            <p className="lede rv d1">레벨, 일정, 장소가 궁금하면 남겨주세요. 확인 후 연락드릴게요.</p>
            <InquiryForm />
          </div>
        </section>
      </main>

      <Footer applyHref="/apply" inquiryHref="/inquiry" />
    </>
  );
}
