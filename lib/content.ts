export const landingContent = {
  nav: {
    logo: "The Round",
    cta: "무료 1기 신청"
  },
  hero: {
    label: "베타 1기 모집 중",
    titleLines: ["떠들다 보면,", "영어가 트입니다"],
    subtitleLines: [
      "영어 실력이 부족한 게 아니에요. 마음 편히 말할 기회가 없었을 뿐.",
      "The Round는 영어가 자연스럽게 오가는 순간을 만드는 소셜 클럽입니다."
    ],
    cta: "무료 1기 신청",
    note: "중급·고급 각 6명 한정",
    imageSrc: undefined,
    imagePlaceholder: "메인 이미지 — 둘러앉아 웃으며 영어로 대화하는 장면"
  },
  introducing: {
    eyebrow: "Introducing The Round",
    headline: "The Round는 이렇게 운영돼요",
    steps: [
      {
        name: "레벨 기수제",
        description:
          "한 달 4회, 영어 수준이 비슷한 멤버들이 정해진 시간에 모여 다양한 주제로 대화를 나눠요.",
        items: ["같은 멤버", "한 달 4회", "중급·고급 각 6명"]
      },
      {
        name: "체계적인 피드백",
        description:
          "말하고 끝나는 시간이 아니라, 내가 어떻게 말했고 무엇이 좋아졌는지 개인별로 다시 보고 보완할 수 있게 정리해드려요.",
        items: ["개인 피드백", "Recap Session", "Monthly Report"]
      },
      {
        name: "전문 영어 MC",
        description:
          "전문 영어 MC가 대화 흐름을 잡아 모두가 고르게 말할 수 있는 분위기를 만들고, 자연스러운 표현력까지 끌어올려줘요.",
        items: ["Guided Conversation", "Real-world English"]
      }
    ]
  },
  expectations: {
    headline: "The Round에서 기대할 수 있는 것",
    items: [
      "레벨별 기수제",
      "Session Recap",
      "정기 리포트",
      "Conversation tips",
      "개인 피드백",
      "전문 영어 MC",
      "Monthly events",
      "Real-world English",
      "다양한 주제"
    ]
  },
  pricing: {
    eyebrow: "The Round Membership",
    headline: "이 모든 경험을 무료로",
    sublinePrefix: "The Round 멤버십",
    originalPrice: "100,000원",
    freePrice: "0원",
    message: "1기는 무료로 운영해요. 편하게 오셔서 The Round의 첫 분위기를 만들어주세요.",
    benefits: [
      {
        name: "레벨별 기수제",
        description: "비슷한 수준의 멤버와 한 달 4회, 꾸준히 영어로 대화해요."
      },
      {
        name: "전문 영어 MC",
        description: "대화가 한쪽으로 치우치지 않도록 흐름을 잡고 모두가 말할 수 있게 이끌어요."
      },
      {
        name: "Real-world English",
        description: "교과서 표현보다 실제 대화에서 자연스럽게 쓰이는 표현을 익혀요."
      },
      {
        name: "Session Recap",
        description: "그날 나온 좋은 표현과 놓치기 쉬운 포인트를 다시 정리해드려요."
      },
      {
        name: "개인 피드백",
        description: "내 말하기 습관과 약점을 개인별로 짚어 다음 대화에 반영해요."
      },
      {
        name: "정기 리포트",
        description: "한 달 동안의 참여와 성장을 눈에 보이게 확인해요."
      }
    ]
  },
  teams: [
    {
      name: "초급반",
      englishName: "Beginner",
      levelOption: "초급",
      description: "영어로 한마디 꺼내는 것부터 연습이 필요해요.",
      capacity: "6명",
      status: "준비중"
    },
    {
      name: "중급반",
      englishName: "Intermediate",
      levelOption: "중급",
      description: "영어로 대화는 가능하지만 자주 막혀요.",
      capacity: "6명",
      status: "모집 중"
    },
    {
      name: "고급반",
      englishName: "Advanced",
      levelOption: "고급",
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
  "초급",
  "중급",
  "고급"
] as const;

export const TEAM_CAPACITY = 6;

export type EnglishLevel = (typeof levelOptions)[number];
