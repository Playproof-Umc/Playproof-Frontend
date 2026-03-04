# ♞ PlayProof Frontend

🎮 Playproof 
매칭을 넘어 관계의 지속으로, 신뢰 기반 게임 팀워크 관리 플랫폼
많은 게이머가 무작위 매칭에서 발생하는 ‘팀 운’이나 ‘트롤링’ 같은 통제 불가능한 변수로 피로도를 겪고 있습니다. Playproof는 이를 구조적 문제로 정의하고, 단순한 일회성 매칭을 넘어 지속 가능한 팀 관계를 전제로 하는 환경을 설계합니다.

💡 Service Vision: "Matching to Living"
Playproof는 매칭이라는 시작점을 지나, 게이머들이 플레이 과정에서 편의를 느끼고 오랫동안 머무를 수 있는 실질적인 커뮤니티 공간(아지트)을 지향합니다.
* 휘발되지 않는 관계: 단발성 만남을 넘어 팀 경험이 누적되는 구조
* 데이터 기반의 신뢰: 매너 점수(TS)와 플레이 스타일 태그를 통한 검증
* 관리의 효율화: 팀 스케줄 및 미디어 아카이브를 통한 체계적인 팀워크 관리

🛠️ Service Structure 
Playproof는 유저의 유입부터 관계 형성, 유지까지 총 9개의 탭으로 구성된 유기적인 여정을 제공합니다.

1. 진입 및 온보딩 
*  로그인과 회원가입 과정을 최소화하여 접근성 향상.
* 온보딩 단계에서 유저 데이터를 수집하여, 이후 매칭 단계에서의 불필요한 이탈을 방지하고 정확도를 높입니다.
2. 매칭 
* 단순 모집 게시판 형태에서 벗어나 게임별 조건 설정, 맞춤 추천 로직을 제공합니다.
*  유저가 원하는 조건의 팀을 직접 탐색하고 선택할 수 있는 구조입니다.
3. 팀 아지트 (Azit) 
* 매칭된 팀이 단발성으로 끝나지 않도록 지원하는 독립적인 공간입니다.
* 실시간 텍스트/음성 채팅, 팀 스케줄 관리, 플레이 기록(미디어) 아카이브를 통해 팀의 히스토리를 쌓아갑니다.
4. 신뢰 시스템 
* 평판 시스템: 유저의 행동 피드백과 신고 시스템을 통해 매너 점수(TS)를 관리합니다.
* 전적 연동: 실제 인게임 전적을 연동하여 매칭의 신뢰도를 뒷받침합니다.

✨ Implementation Highlights 
서비스의 흐름이 끊기지 않도록 UI/UX 인터랙션 설계에 집중하여 개발되었습니다.
* Seamless Flow: 홈에서 매칭 확인 후 팀 구성 시, 즉시 아지트로 연결되어 실시간 채팅과 활동으로 이어지는 유기적인 사용자 흐름(User Flow)을 구현했습니다.
* State-Driven Interaction:  선택한 게임 종류에 따라 입력 항목과 상태가 실시간으로 변경되는 로직 구현.
    * 조건부 렌더링: 유저의 현재 상태(권한, 작성 이력 등)를 감지하여 댓글 활성화, 중복 작성 방지 카드 인터랙션 등을 자동 제어합니다.
* Responsive Logic: 필터 적용 및 정렬 등 유저의 모든 액션에 즉각적으로 반응하는 고도화된 인터랙션 로직이 반영되어 있습니다.

🏆 Project Achievement
* UMC(University makes Challenge) 대학생 연합 개발 동아리에서 총 73팀(약 803명) 중 우수상을 수상하였습니다🥇
* 기획부터 디자인 시스템 구축, 프론트엔드&백엔드 개발에서 배포까지 유기적인 협업을 통해 완성된 프로젝트입니다.
> **랜덤 매칭의 불확실성을 줄이고, 신뢰 기반의 팀워크를 만드는 게이머 매칭 플랫폼**

PlayProof의 프론트엔드 저장소입니다.
React, TypeScript, Vite를 기반으로 하며, 유지보수성을 위해 **기능 단위(Feature-based) 아키텍처**를 따릅니다.

<br/>

## 🛠 Tech Stack

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Core** | ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) | UI 라이브러리 및 언어 |
| **Build** | ![Vite](https://img.shields.io/badge/Vite-7.2-purple) | 빌드 도구 및 개발 서버 |
| **State** | **TanStack Query** (Server), **Zustand** (Client) | 서버/클라이언트 상태 관리 분리 |
| **Network** | **Axios** | HTTP 비동기 통신 라이브러리 |
| **Style** | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC) | CSS |
| **Routing** | **React Router DOM** | SPA 라우팅 |
| **Date** | **React Day Picker** | 캘린더/날짜 선택 UI |
| **Icons** | **lucide-react** | 아이콘 라이브러리 |
| **Pkg Mgr** | **npm** | 패키지 매니저 |
| **Quality** | ESLint, Prettier | 코드 품질 및 포맷팅 (수동 실행) |

<br/>

## Getting Started (설치 및 실행)

이 프로젝트는 **Node.js v20 (LTS)** 이상 환경을 권장합니다.
```bash
node -v
```

### 1. 프로젝트 클론
```bash
git clone git@github.com:Playproof-Umc/Playproof-Frontend.git
cd Playproof-Frontend
```

### 2. 패키지 설치
```bash
npm install
```
> **Tip:** 팀원들과 정확히 동일한 버전을 설치하려면 `npm ci` 명령어를 사용하는 것이 좋습니다.

### 3. 환경 변수 설정 (.env)
루트 디렉토리에 `.env` 파일을 생성하고, 팀 노션(Notion)에 공유된 키 값을 입력하세요.

*(예시)*
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_SOCKET_URL=http://localhost:8080
```

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속하여 확인합니다.

### 5. 프로덕션 빌드 확인 (선택)
```bash
npm run build
npm run preview
```

<br/>

## 📂 Project Structure (폴더 구조)

우리는 **기능(Feature) 중심의 아키텍처**를 사용합니다.
관련된 로직(UI, Hook, API)이 하나의 폴더에 모여 있어야 유지보수가 쉽습니다.

```text
src/
├── assets/              # 이미지, 폰트 등 정적 리소스
├── components/          # 전역 공용 UI / 레이아웃
│   ├── layout/          # AppLayout, Navbar
│   └── ui/              # 디자인 시스템 기반 원자 컴포넌트
│
├── api/                 # 프론트에서 사용하는 API 요청/타입 (서버리스 제외)
│   ├── riot/
│   ├── valorant/
│   └── overwatch/
│
├── types.ts             # 전역 공통 타입 정의
│
├── features/            # 핵심 도메인별 기능 모음
│   ├── auth/            # 로그인, 회원가입
│   ├── community/       # 커뮤니티, 하이라이트
│   ├── home/            # 홈
│   ├── matching/        # 매칭
│   ├── mypage/          # 마이페이지
│   ├── notification/    # 알림
│   ├── profile/         # 프로필
│   ├── store/           # 상점
│   ├── team/            # 아지트, 팀 캘린더, 엠블럼
│   │   ├── components/
│   │   │   ├── azit/
│   │   │   ├── feedback/
│   │   │   └── schedule/
│   │   ├── hooks/
│   │   │   ├── useAzitFeedback.ts
│   │   │   ├── useAzitMedia.ts
│   │   │   ├── useAzitMediaViewer.ts
│   │   │   ├── useAzitRooms.ts
│   │   │   └── useAzitSchedules.ts
│   │   └── utils/
│   │       └── pendingFeedback.ts
│   └── user/            # 유저
│
├── pages/               # 라우트 페이지 (features를 조립해서 화면 구성)
│   ├── auth/
│   ├── azit/
│   ├── community/
│   ├── home/
│   ├── matching/
│   ├── mypage/
│   ├── profile/
│   └── store/
│
├── services/            # API 호출 인스턴스 (Axios 설정)
├── store/               # 전역 클라이언트 상태 (Zustand)
├── utils/               # 순수 자바스크립트 유틸 함수
└── App.tsx
```

###  개발 원칙
1. **Colocation:** 특정 기능에서만 쓰이는 컴포넌트는 `features/기능명/components` 안에 둡니다.
2. **Barrel Exports:** `index.ts`를 활용하여 import 경로를 깔끔하게 유지합니다.
3. **Absolute Import:** `../../` 대신 `@/features/user` 와 같이 절대 경로(`@`)를 사용합니다.

<br/>

##  Contribution Guide (협업 규칙)

### 1. Git Flow 및 브랜치 전략
* `main`: 배포 가능한 안정 버전
* `develop`: 개발 중인 코드 (PR 대상)

**📌 브랜치 명명 규칙: `타입/기능명_작성자`**
누가 작업 중인지 명확히 알기 위해 **기능명 뒤에 작성자 이름(이니셜)**을 붙입니다.

| 타입 | 설명 | 사용 예시 |
| :--- | :--- | :--- |
| `feat` | 새로운 기능 추가 | `feat/login_Elirc(본인 닉네임)` |
| `fix` | 버그 수정 | `fix/matching-error_Elirc(본인 닉네임)` |
| `design` | CSS 등 스타일 변경 | `design/main-color_Elirc(본인 닉네임)` |
| `refactor` | 코드 리팩토링 | `refactor/api-logic_Elirc(본인 닉네임)` |
| `docs` | 문서 수정 | `docs/readme_Elirc(본인 닉네임)` |

### 2. Commit Convention
커밋 메시지는 **Conventional Commits** 규칙을 따릅니다.

* `feat: 로그인 페이지 퍼블리싱`
* `fix: 매칭 필터링 오류 수정`
* `docs: 리드미 수정`

### 3. Code Quality (PR 전 필독!)

우리는 코드 품질을 유지하기 위해 PR(Pull Request)을 올리기 전, 로컬에서 **자가 검사**를 수행해야 합니다.

**✅ PR 전 실행 명령어**
작업을 마치고 원격 저장소에 올리기 전, 터미널에 아래 명령어들을 입력하여 에러가 없는지 확인합니다.

| 명령어 | 역할 | 설명 |
| :--- | :--- | :--- |
| `npm run type-check` | **타입 검사** | TypeScript 문법 오류나 타입 불일치를 잡아냅니다. (컴파일은 하지 않음) |
| `npm run lint` | **스타일 검사** | ESLint 규칙(미사용 변수, 컨벤션 등) 위반 사항을 확인합니다. |

```bash
# 실행 예시
npm run type-check && npm run lint
```

<br/>

## ⚠️ Troubleshooting

**Q. `npm install` 시 에러가 발생해요.**
<br/>
A. Node 버전이 맞는지 확인하세요. (`node -v` >= 20). `nvm use 20`을 권장합니다. 캐시 문제라면 `npm cache clean --force` 후 다시 시도해 보세요.

**Q. import 경로에서 `@/`가 인식이 안 돼요.**
<br/>
A. VS Code를 재시작하거나 **`Ctrl + Shift + P` (Win) / `Cmd + Shift + P` (Mac)** 를 눌러 명령 팔레트를 열고 `TypeScript: Restart TS server`를 실행해 보세요.

---
**문의사항** 

**문의사항은 Discord `#웹-chat` 채널로 주세요.**
