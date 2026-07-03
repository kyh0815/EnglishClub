import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "영어를 잘 못해도 신청할 수 있나요?",
    answer:
      '네, 가능해요. "My favorite movie is Titanic. I like the acting." 정도로 좋아하는 걸 영어로 말할 수 있다면 충분합니다. 문장이 완벽하지 않아도, 조금 더듬거려도 괜찮아요. The Round는 \'영어 잘하는 사람들의 모임\'이 아니라, 편하게 입을 떼보는 자리니까요.'
  },
  {
    question: "멤버들과 실력 차이가 나면 어떡하죠?",
    answer:
      "그런 일이 없도록 설계했어요. 신청서가 아니라 레벨 체크 콜로 배정하고, 첫 1~2회차 동안 MC가 직접 지켜보며 필요하면 더 잘 맞는 그룹으로 조정해드려요. 운영 중에도 언제든 이동을 도와드립니다."
  },
  {
    question: "모임이 제 레벨과 안 맞으면 바꿀 수 있나요?",
    answer:
      "물론이에요. 운영 중에 레벨이 맞지 않는다고 판단되면 더 잘 맞는 그룹으로 다시 안내해 드립니다. 너무 쉽거나 너무 어려워서 혼자 겉도는 일이 없도록, 저희가 먼저 살펴보고 챙겨요."
  },
  {
    question: "초급반은 언제 열리나요?",
    answer:
      "지금은 중·고급반을 먼저 시범 운영하고 있어요. 초급반은 준비가 되는 대로 열 예정이고, 미리 신청해 두시면 오픈 소식을 가장 먼저 전해드릴게요."
  },
  {
    question: "모임 멤버는 매번 바뀌나요?",
    answer:
      "같은 기수 안에서는 멤버가 고정돼요. 매번 새로운 사람과 처음부터 다시 시작하는 대신, 같은 얼굴들과 회차를 거듭하며 점점 편해지고 대화가 깊어지도록 설계했습니다."
  },
  {
    question: "정말 영어만 사용하나요?",
    answer:
      "네. 실제로 100% 영어로만 진행해요. 완벽한 문장을 말해야 한다는 뜻은 아니고, 틀려도 영어로 시도해보는 환경을 만드는 것이 원칙입니다."
  },
  {
    question: "혼자 가도 어색하지 않나요?",
    answer:
      "괜찮아요. 대부분 처음엔 혼자 오고, 모두가 대화하면서 자연스럽게 친해지는 자리예요. 전문 영어 MC가 분위기와 대화 흐름을 잡아드려요."
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
