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
    videoSrc: "/the_round_landing_hero.mp4",
    videoSources: undefined,
    imagePlaceholder: "메인 이미지 — 둘러앉아 웃으며 영어로 대화하는 장면"
  },
  serviceInfo: {
    venue: "📍 서울 마포구 양화로 133 서교타워 901호 은하연 홍대 2호점 (홍대 도보 1분)",
    venueAddress: "서울 마포구 양화로 133 서교타워 901호 은하연 홍대 2호점",
    venueAddressWithAccess: "서울 마포구 양화로 133 서교타워 901호 은하연 홍대 2호점 (홍대 도보 1분)"
  },
  introducing: {
    headline: "공부보다 가볍고, 모임보다 깊게",
    caption: "The Round는 대화가 흐르고 성장이 남는 영어 소셜 클럽입니다.",
    steps: [
      {
        name: "한 달, 한 테이블",
        description:
          "월 4회, 세션당 2시간. 기수제로 같은 멤버들과 함께해요.",
        items: ["월 4회", "세션당 2시간", "같은 멤버"]
      },
      {
        name: "레벨이 비슷한 사람들과",
        description:
          "신중한 레벨 체크를 통해 함께 배정된 사람들과 부담없이 영어로 대화해요.",
        items: ["레벨 체크", "부담 없는 대화"]
      },
      {
        name: "전문 MC와 함께",
        description:
          "모두가 고르게 말할 수 있도록, 대화의 흐름을 잡아드려요.",
        items: ["Guided Conversation", "고른 참여"]
      }
    ]
  },
  featureBlocks: [
    {
      id: "conversation",
      headline: "흥미로운 주제들로, 영어로만 대화해요.",
      body: [
        { text: "발표도 토론도 아니에요. " },
        { text: "스몰토크로 몸을 풀고", strong: true },
        {
          text: ", 그날의 토픽 2-3개를 두고 편하게 대화를 주고받아요. 정해진 순서나 형식 없이, 대화가 흐르는 대로 이어가요."
        }
      ],
    },
    {
      id: "level",
      headline: "레벨에 맞는 사람들끼리, 함께 해요.",
      body: [
        { text: "신청서만 보고 반을 나누지 않아요. " },
        { text: "10분 레벨 체크 콜", strong: true },
        {
          text: "로 실제 말하기를 확인하고, 편차가 적도록 배정해요. 첫 1-2회차엔 MC가 직접 지켜보고, 더 잘 맞는 테이블이 있다면 "
        },
        { text: "먼저 제안", strong: true },
        { text: "드려요." }
      ],
      link: {
        label: "내 레벨 확인하기",
        href: "#apply"
      }
    },
    {
      id: "feedback",
      headline: "대화에서 끝나지 않고, 함께 성장해요.",
      body: [
        { text: "세션이 끝나면 오늘의 좋은 표현과 내 말하기 포인트를 담은 " },
        { text: "세션 Recap", strong: true },
        { text: "이 도착해요. 한 달이 지나면 " },
        { text: "Monthly Report", strong: true },
        { text: "로 참여와 성장을 눈으로 확인해요." }
      ],
      link: {
        label: "무료로 시작하기",
        href: "#apply"
      }
    }
  ],
  expectations: {
    headline: "The Round에서",
    items: [
      "비슷한 레벨로 만나요",
      "부담 없이 입을 떼요",
      "새로운 표현을 내 것으로 만들어요",
      "좋은 표현을 다시 봐요",
      "내 말하기를 돌아봐요",
      "성장을 기록해요",
      "영어로만 어울려요",
      "다양한 주제로 이어가요"
    ]
  },
  levelSelfCheck: {
    question: "What did you do last weekend?",
    helper: "잘 모르겠어도 괜찮아요. 최종 레벨은 레벨 체크 콜에서 함께 정해드려요.",
    levels: [
      {
        name: "초급",
        status: "사전예약",
        canDo: "문법이 틀려도 괜찮아요. 하고 싶은 말이 전해지면 충분해요.",
        example: '"I meet friend. We eat pasta. It was good."'
      },
      {
        name: "중급",
        canDo: "시제와 문장 연결이 익숙하고, 흐름 있게 이야기할 수 있어요.",
        example:
          '"I met my friends. For lunch, we ate pasta, and after that we went to watch a movie."'
      },
      {
        name: "고급",
        canDo: "자연스러운 표현을 얹어 감상과 뉘앙스까지 전할 수 있어요.",
        example:
          '"I met my boyfriend - we hang out all the time, but this weekend we tried a cooking class for a change. I had never done anything like that before, but it was surprisingly fun."'
      }
    ]
  },
  pricing: {
    eyebrow: "1기 한정 무료 모집",
    headline: "The Round의 첫 테이블을 함께 채워주세요",
    message:
      "1기는 The Round의 첫 분위기를 함께 만들어갈 파운딩 멤버를 모시는 자리입니다.\n무료로 시작하지만, 가볍게 운영하지 않습니다.\n한 달 4회, 같은 멤버와 끝까지 함께하며\n편안하지만 진심 있는 영어 대화를 만들어갈 분을 기다립니다.",
    venueLabel: "1기 세션 장소",
    venueAddress: "서울 마포구 양화로 133 서교타워 901호 은하연 홍대 2호점 (홍대 도보 1분)",
    benefits: [
      {
        name: "월 4회 정규 세션",
        description: "정기적으로 같은 멤버들과 다양한 주제로 대화해요."
      },
      {
        name: "실시간 표현 코칭",
        description: "자연스럽게 대화하며 새로운 표현을 배우고, 내 것으로 만들어요."
      },
      {
        name: "세션 Recap",
        description: "오늘의 대화 속 좋은 표현들과 놓치기 쉬운 포인트를 정리해줘요."
      },
      {
        name: "Monthly Report",
        description: "한 달 동안의 참여와 성장을 눈으로 직접 확인해요."
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
      status: "사전예약"
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

export const applicationDateOptions = [
  "8월 6일 (목) - 중급반 (예시)",
  "8월 7일 (금) - 고급반 (예시)"
] as const;

export const levelOptions = [
  "초급",
  "중급",
  "고급"
] as const;

export const TEAM_CAPACITY = 6;

export type EnglishLevel = (typeof levelOptions)[number];
