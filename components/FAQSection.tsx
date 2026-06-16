import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "초급반은 언제 열리나요?",
    answer:
      "초급반은 현재 준비 중입니다. 이번 모집은 중급반과 고급반부터 먼저 운영합니다."
  },
  {
    question: "1기 이후에도 같은 시간에 계속 참여할 수 있나요?",
    answer:
      "정식 운영 일정은 아직 조정 중입니다. 1기 신청자에게 우선적으로 다음 일정과 참여 방식을 안내드릴 예정입니다."
  }
];

export default function FAQSection() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="wrap faq-wrap">
        <span className="label rv">FAQ</span>
        <h2 id="faq-title" className="rv">
          자주 묻는 질문
        </h2>
        <div className="faq-list rv d1">
          {faqItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown className="faq-chevron" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
