import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RevealController from "@/components/RevealController";

export default function ApplyPage() {
  return (
    <>
      <RevealController />
      <Nav />

      <main>
        <section id="apply" className="apply-page">
          <div className="wrap apply-wrap">
            <ApplicationForm />
          </div>
        </section>
      </main>

      <Footer applyHref="/apply" inquiryHref="/inquiry" />
    </>
  );
}
