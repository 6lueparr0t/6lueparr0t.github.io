# Space 게시판 GitHub API 마이그레이션 (REST → GraphQL)

## 배경

`src/pages/Space.tsx` (와 `SpaceView.tsx`) 는 GitHub Issues 를 게시판으로 사용한다.
데이터 접근은 모두 `src/lib/space.ts` 에 모여 있고, 지금은 GitHub **REST API v3**(`octokit.request`) 를 사용한다.

- `GET /repos/{owner}/{repo}/issues` — 목록
- `GET /repos/{owner}/{repo}/issues/{number}` — 단일 이슈
- `GET /repos/{owner}/{repo}/issues/{number}/comments` — 댓글
- `GET /search/issues?q=...` — 키워드 검색

이를 GitHub 가 권장하는 최신 **GraphQL API v4**(`octokit.graphql`) 로 교체한다.

## 변경 범위 (surgical)

`src/lib/space.ts` **내부만** 교체한다. 외부로 노출되는 두 함수의 **시그니처와 반환 형태는 그대로 유지**한다.

```ts
getList(query, { page, per_page })  // → { list, next, prev, total, status?, message? }
getIssue(option, issueNumber)       // → { issue, comments, status?, message? }
```

> `total`(전체 페이지 수) 은 페이지 번호 UI 를 위해 추가된 필드다. 아래 "전체 페이지 수" 참고.

따라서 다음 파일들은 **수정하지 않는다.**

- `src/pages/Space.tsx`, `src/pages/SpaceView.tsx` (로더/상태)
- `src/components/space/*` (`IssueTable`, `IssuePagination`, `SearchInput`, `view/*`)
- `src/components/components.d.ts` 의 `Issue` 타입

제거되는 내부 헬퍼(외부에서 import 하지 않음을 확인): `makeQuery`, `parsePagination`,
`getGithubIssue`, `getGithubIssueComment`, `search`, `parseData`, `parseDataForComments`.

## 필드 매핑

컴포넌트가 소비하는 `Issue` 타입은 REST 의 snake_case 필드명을 그대로 쓰고 있다.
GraphQL 응답(camelCase) 을 동일한 형태로 변환한다.

| `Issue` (컴포넌트) | REST              | GraphQL                 |
| ------------------ | ----------------- | ----------------------- |
| `number`           | `number`          | `number`                |
| `title`            | `title`           | `title`                 |
| `body`             | `body` (markdown) | `body` (markdown)       |
| `created_at`       | `created_at`      | `createdAt`             |
| `updated_at`       | `updated_at`      | `updatedAt`             |
| `node_id`          | `node_id`         | `id`                    |
| `user.login`       | `user.login`      | `author.login`          |
| `user.avatar_url`  | `user.avatar_url` | `author.avatarUrl`      |
| `user.site_admin`  | `user.site_admin` | (미지원 → 항상 undefined) |

`site_admin` 은 UI 에서 사용되지 않으므로 제거해도 영향 없음.
댓글 노드에는 `number`/`title` 이 없으므로 `number: 0` 으로 채운다(`IssueComments` 는 `node_id`·`user`·`created_at`·`body` 만 사용).

## 페이지네이션 전략

REST 는 `page`/`per_page` + `Link` 헤더로 **페이지 번호** 기반이고, 현재 UI(`IssuePagination`)
와 딥링크(`?page=N`) 도 페이지 번호에 의존한다. GraphQL 은 **커서 기반**(after/before)이라
임의 페이지로 점프가 불가능하다.

UI 변경을 피하기 위해, 페이지 번호 인터페이스를 GraphQL 위에서 에뮬레이트한다.

- `first = min(page * per_page, 100)` 개를 가져온 뒤
- `nodes.slice((page - 1) * per_page, page * per_page)` 로 해당 페이지 구간만 사용
- `next = pageInfo.hasNextPage ? page + 1 : 0`, `prev = page > 1 ? page - 1 : 0`

### 전체 페이지 수 (페이지 번호 UI)

`IssuePagination` 이 `1, 2, …` 페이지 번호 버튼을 그리려면 전체 페이지 수가 필요하다.
GraphQL connection 의 `totalCount`(목록) / `issueCount`(검색) 로 전체 개수를 받아 계산한다.

- `getList` 가 `total = max(ceil(totalCount / per_page), 1)` 을 추가로 반환
- 로더 → 페이지 state → `IssuePagination` 으로 전달 (`RouteLoaderData.total`, `PaginationProps.total`)
- `IssuePagination` 은 `PAGE_LENGTH(=10)` 개씩 블록으로 묶어 현재 블록의 번호들을 렌더
  (`blockStart = floor((page-1)/PAGE_LENGTH)*PAGE_LENGTH + 1`)

### 한계 (의도된 트레이드오프)

- GraphQL `first` 의 상한은 **100**. `per_page = 10`, `PAGE_LENGTH = 10` 이므로
  최대 page 10(= 100개)까지 정확히 동작한다. 그 이상은 자른 구간이 비게 된다.
- 깊은 페이지일수록 over-fetch 가 늘어난다(개인 블로그 규모에선 무시 가능).
- 진짜 커서 기반으로 가려면 `next`/`prev` 를 커서 문자열로 바꿔야 하는데, 이는
  `PaginationProps`·`IssuePagination`·두 페이지를 모두 손대야 하므로 이번 범위에서 제외.

## 동작 보존 노트

- 목록은 REST 기본값과 동일하게 **OPEN 이슈만**, `CREATED_AT DESC` 정렬.
  (`states: OPEN`. 닫힌 이슈도 보이게 하려면 `states: [OPEN, CLOSED]` 로 변경)
- 검색 쿼리 문자열: `{keyword} in:{in} repo:{owner}/{repo} is:issue`.
  - **`is:issue` 필수.** GraphQL `search(type: ISSUE)` 는 GitHub 의 새 이슈 검색 동작상
    `is:issue` 한정자가 없으면 `repo:` 만으로는 결과가 0건이 된다(실측 확인).
    REST `/search/issues` 는 암묵적으로 이슈로 스코프돼서 없어도 동작했었음.

## 환경 변수

GraphQL API 는 인증이 필수다. 신규 토큰 변수를 우선 사용하고, 없으면 기존 classic 토큰으로 폴백한다.

```
VITE_APP_GIT_TOKEN          # 우선 사용 (fine-grained / 신규 PAT)
VITE_APP_GIT_TOKEN_CLASSIC  # 폴백 (기존)
```

두 변수 모두 `.env.example` 에 이미 존재한다. (classic PAT 도 GraphQL 에서 동작함)

## GraphQL 쿼리

**목록**

```graphql
query ($owner: String!, $repo: String!, $first: Int!) {
  repository(owner: $owner, name: $repo) {
    issues(first: $first, states: OPEN, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes { number title body createdAt updatedAt id author { login avatarUrl } }
      pageInfo { hasNextPage }
    }
  }
}
```

**검색**

```graphql
query ($q: String!, $first: Int!) {
  search(query: $q, type: ISSUE, first: $first) {
    nodes { ... on Issue { number title body createdAt updatedAt id author { login avatarUrl } } }
    pageInfo { hasNextPage }
  }
}
```

**단일 이슈 + 댓글**

```graphql
query ($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      number title body createdAt updatedAt id author { login avatarUrl }
      comments(first: 100) {
        nodes { body createdAt updatedAt id author { login avatarUrl } }
      }
    }
  }
}
```

## 검증

- `pnpm tsc --noEmit` (또는 빌드) 로 타입 통과 확인 → 컴포넌트 계약이 유지됐는지 확인.
- `pnpm dev` 로 `/space` 목록·페이지네이션·검색, `/space/{번호}` 단일 이슈·댓글 동작 확인.
- 의존성: `octokit` 패키지에 GraphQL 클라이언트가 포함되어 있어 추가 설치 불필요.
