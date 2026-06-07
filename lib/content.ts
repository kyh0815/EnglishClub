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
      "그 기회를 만드는 영어 소셜 클럽."
    ],
    cta: "무료 1기 신청",
    note: "초급·중급·고급 각 6명 한정",
    imageSrc: "/images/the-round-hero.png",
    imagePlaceholder: "메인 이미지 — 둘러앉아 웃으며 영어로 대화하는 장면"
  },
  teams: [
    {
      name: "초급반",
      englishName: "Beginner",
      levelOption: "초급 — 입을 떼는 것부터 (왕초보 포함)",
      description: "영어로 한마디 꺼내는 것부터 연습이 필요해요.",
      capacity: "6명",
      status: "모집 중"
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
