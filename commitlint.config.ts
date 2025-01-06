// commitlint.config.ts
module.exports = {
  // 커밋 메시지 규칙 정의
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [1, "always"], // 본문 앞에 빈 줄 추가 (경고)
    "body-max-line-length": [2, "always", 100], // 본문 줄 길이 제한 (100자, 오류)
    "footer-leading-blank": [1, "always"], // 푸터 앞에 빈 줄 추가 (경고)
    "footer-max-line-length": [2, "always", 100], // 푸터 줄 길이 제한 (100자, 오류)
    "header-max-length": [2, "always", 100], // 헤더 길이 제한 (100자, 오류)
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]], // 서브젝트는 특정 대소문자 형식 금지 (오류)
    "subject-empty": [2, "never"], // 서브젝트 비어있으면 안 됨 (오류)
    "subject-full-stop": [2, "never", "."], // 서브젝트 끝에 마침표 금지 (오류)
    "type-case": [2, "always", "lower-case"], // 타입은 소문자만 허용 (오류)
    "type-empty": [2, "never"], // 타입은 반드시 작성해야 함 (오류)
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ], // 허용 타입 목록 설정 (오류)
  },
  // 커밋 메시지 작성 가이드 프롬프트 설정
  prompt: {
    questions: {
      type: {
        description: "커밋 타입을 선택하세요.",
        enum: {
          feat: { description: "새로운 기능 추가", title: "기능", emoji: "✨" },
          fix: { description: "버그 수정", title: "버그 수정", emoji: "🐛" },
          docs: {
            description: "문서 관련 변경",
            title: "문서",
            emoji: "📚",
          },
          style: {
            description: "코드 스타일 변경 (포맷팅, 세미콜론 추가 등)",
            title: "스타일",
            emoji: "💎",
          },
          refactor: {
            description: "코드 리팩토링 (기능 추가나 버그 수정 없음)",
            title: "리팩토링",
            emoji: "📦",
          },
          perf: {
            description: "성능 최적화 코드 변경",
            title: "성능",
            emoji: "🚀",
          },
          test: {
            description: "테스트 추가 또는 수정",
            title: "테스트",
            emoji: "🚨",
          },
          build: {
            description: "빌드 시스템 또는 외부 의존성 변경",
            title: "빌드",
            emoji: "🛠",
          },
          ci: {
            description: "CI 설정 변경 (예: Travis, GitHub Actions)",
            title: "CI",
            emoji: "⚙️",
          },
          chore: {
            description: "기타 변경 (코드 수정 없음)",
            title: "잡무",
            emoji: "♻️",
          },
          revert: {
            description: "이전 커밋 되돌리기",
            title: "되돌리기",
            emoji: "🗑",
          },
        },
      },
      scope: {
        description: "변경 범위를 입력하세요 (예: 컴포넌트 이름, 모듈명 등)",
      },
      subject: {
        description: "변경 사항을 간단하게 설명하세요.",
      },
      body: {
        description: "변경 사항을 상세하게 설명하세요.",
      },
      isBreaking: {
        description: "이 변경 사항이 브레이킹 체인지인가요?",
      },
      breakingBody: {
        description: "브레이킹 체인지에 대한 설명을 작성하세요.",
      },
      breaking: {
        description: "브레이킹 체인지 내용을 입력하세요.",
      },
      isIssueAffected: {
        description: "이 변경 사항이 이슈와 연관되어 있나요?",
      },
      issuesBody: {
        description: "관련 이슈에 대한 설명을 작성하세요.",
      },
      issues: {
        description: '이슈 번호를 입력하세요 (예: "fix #123").',
      },
    },
  },
};
