export const landingContent = {
  nav: {
    logo: "The Round",
    cta: "무료 1기 신청"
  },
  hero: {
    label: "무료 베타 1기 모집",
    titleLines: ["떠들다 보면,", "영어가 트입니다"],
    subtitleLines: [
      "영어 실력이 부족한 게 아니에요. 마음 편히 말할 기회가 없었을 뿐.",
      "Your First and Last English Social Club"
    ],
    cta: "무료 1기 신청",
    note: "중급·고급 각 6명 한정",
    imageSrc: "/images/the-round-hero.png",
    imagePlaceholder: "메인 이미지 — 둘러앉아 웃으며 영어로 대화하는 장면"
  },
  difference: {
    label: "The Round가 다른 이유",
    title: "내 영어가 자신감에서 끝나지 않도록",
    items: [
      {
        name: "Guided Conversation",
        title: "좋은 대화를 위한 원활한 진행",
        description:
          "경험 많은 진행자가 흐름을 잡아주기 때문에 누구나 부담 없이 참여할 수 있고, 대화는 더 깊어집니다."
      },
      {
        name: "Expression Recap",
        title: "재밌는 대화에서 유익함을",
        description:
          "대화 끝 짧은 Recap 세션을 통해 대화 속에서 나온 표현과 흐름을 정리하며 내 것으로 만듭니다."
      },
      {
        name: "Real-World English",
        title: "실제로 쓰이는 영어를",
        description:
          "교과서 속 상황이 아닌 실제 대화 상황 속에서 가장 자연스러운 영어를 익힙니다."
      }
    ]
  },
  teams: [
    {
      name: "초급반",
      englishName: "Beginner",
      levelOption: "초급 — 입을 떼는 것부터 (왕초보 포함)",
      description: "영어로 한마디 꺼내는 것부터 연습이 필요해요.",
      capacity: "6명",
      status: "준비중"
    },
    {
      name: "중급반",
      englishName: "Intermediate",
      levelOption: "중급 — 더듬더듬 대화는 돼요",
      description: "영어로 대화는 가능하지만 자주 막혀요.",
      capacity: "6명",
      status: "모집 중"
    },
    {
      name: "고급반",
      englishName: "Advanced",
      levelOption: "고급 — 편하게 대화, 더 다듬고 싶어요",
      description: "영어로 편하게 대화하지만 더 자연스럽게 말하고 싶어요.",
      capacity: "6명",
      status: "모집 중"
    }
  ],
  apply: {
    source: "the-round-beta-1",
    successTitle: "신청이 접수됐어요",
    successMessageLines: [
      "1기 자리를 맡아두었어요. 가장 먼저 연락드릴게요.",
      "곧 The Round에서 만나요."
    ]
  },
  inquiry: {
    source: "the-round-landing",
    successTitle: "문의가 접수됐어요",
    successMessageLines: [
      "남겨주신 연락처로 답변드릴게요.",
      "The Round에 관심 가져주셔서 감사합니다."
    ]
  }
} as const;

export const levelOptions = [
  "초급 — 입을 떼는 것부터 (왕초보 포함)",
  "중급 — 더듬더듬 대화는 돼요",
  "고급 — 편하게 대화, 더 다듬고 싶어요",
  "잘 모르겠어요 — 추천해주세요"
] as const;

export const TEAM_CAPACITY = 6;

export type EnglishLevel = (typeof levelOptions)[number];
