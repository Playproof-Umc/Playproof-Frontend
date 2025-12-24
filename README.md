# ♞ PlayProof Frontend

> **랜덤 매칭의 불확실성을 줄이고, 신뢰 기반의 팀워크를 만드는 게이머 매칭 플랫폼**

PlayProof의 프론트엔드 저장소입니다.
React, TypeScript, Vite를 기반으로 하며, 유지보수성을 위해 **기능 단위(Feature-based) 아키텍처**를 따릅니다.

<br/>

## 🛠 Tech Stack

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Core** | ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) | UI 라이브러리 및 언어 |
| **Build** | ![Vite](https://img.shields.io/badge/Vite-7.0-purple) | 빌드 도구 및 개발 서버 |
| **State** | **TanStack Query** (Server), **Zustand** (Client) | 서버/클라이언트 상태 관리 분리 |
| **Style** | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC) | CSS |
| **Routing** | **React Router DOM** | SPA 라우팅 |
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

<br/>

## 📂 Project Structure (폴더 구조)

우리는 **기능(Feature) 중심의 아키텍처**를 사용합니다.
관련된 로직(UI, Hook, API)이 하나의 폴더에 모여 있어야 유지보수가 쉽습니다.

```text
src/
├── assets/              # 이미지, 폰트 등 정적 리소스
├── components/          # 전역 공통 UI (Button, Modal, Input - 디자인 시스템)
├── features/            # ⭐️ 핵심 도메인별 기능 모음
│   ├── auth/            # 로그인, 회원가입
│   ├── user/            # 프로필, TS(신뢰지수), 매너 평가
│   ├── team/            # 아지트, 팀 캘린더, 엠블럼
│   ├── matching/        # 매칭 필터, 용병 리스트
│   └── chat/            # 채팅방, 미디어 아카이브
├── pages/               # 라우트 페이지 (features를 조립해서 화면 구성)
│   ├── HomePage.tsx
│   ├── MatchingPage.tsx
│   └── AzitPage.tsx
├── hooks/               # 전역 커스텀 훅 (useTheme, useScroll)
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