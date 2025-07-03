# Custom-Error-Solution  

React·Redux 기반의 **범용 에러 탐지·안내 솔루션**입니다.  
클라이언트(렌더링·WebSocket·Worker), 네트워크(REST·병렬 요청), 페이지(404/500)까지 전 영역에서 발생하는 예외를 일관된 **모달·전용 페이지**로 수집해 사용자에게 안내하고, 개발자에게는 디버깅 단서를 제공합니다.

---

## 목차
- [기능 개요](#기능-개요)  
- [폴더 구조](#폴더-구조)  
- [설치 & 시작](#설치--시작)  
- [빠른 연동 가이드](#빠른-연동-가이드)  
- [상세 API](#상세-api)  
- [커스터마이징](#커스터마이징)  
- [로드맵](#로드맵)  
- [라이선스](#라이선스)

---

## 기능 개요  
- **전역 모달(ErrorModal)** : 모든 오류 메시지를 XSS 무력화 후 모달로 출력.  
- **에러 코드별 페이지(ErrorPage)** : 4xx·5xx 상태를 사람 친화적인 문구로 매핑.  
- **React ErrorBoundary** : 렌더 단계 예외를 잡아 홈으로 복귀 옵션 제공.  
- **Redux 오류 스토어** : 네트워크·인증·입력 등 범주별 상태 관리.  
- **전용 훅(useErrorHooks)** : `show / clear` 메서드로 간결한 디스패치.  
- **Axios 인터셉터** : CSRF 헤더 삽입 + 5xx·429·408 고정 딜레이 재시도.  
- **Parallel 요청 유틸(requestAllSettled)** : 개별 실패도 모달로 통합.  
- **SafeWebSocket / SafeWorker** : 실시간·백그라운드 오류도 동일 파이프라인으로 전달.  
- **Global Listener** : `window.onerror`, `unhandledrejection`까지 수집.  
- **민감 정보 필터링** : 토큰·ID 마스킹 후 DOMPurify로 Sanitizing.  
- **경량 UI** : 반응형 CSS + `.input-warning` 클래스(아래 참조) 포함.

---

## 폴더 구조
```
custom-error-solution/
├─ api/           # Axios 인터셉터
├─ components/    # ErrorModal · ErrorPage · ErrorBoundary · InputWarning
├─ hook/          # useErrorHooks, createErrorHook
├─ redux/         # errorSlice, rootReducer, store
├─ utils/         # filterProcess, requestHistory 등
└─ App.js         # 데모 및 통합 예시
```

---

## 설치 & 시작
```bash
git clone https://github.com/Vera281226/Custom-Error-Solution.git
cd custom-error-solution
npm install
npm start
```
> 현재 npm 배포 전 단계입니다.  

---

## 빠른 연동 가이드

### 1. 스토어 & ErrorBoundary 래핑
```jsx
// index.js 또는 main entry point
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';

// root element는 보통 public/index.html의 <div id="root"></div>와 연결됩니다.
const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>
);
```

### 2. Axios 교체
```js
import axios from './api/interceptor';   // 기존 axios 대신
```
인터셉터가 자동으로 CSRF 토큰을 첨부하고, 3회(333 ms 간격) 재시도 후 모달을 띄웁니다.

### 3. 훅 사용 예
```jsx
import { useNetworkError } from './hook/useErrorHooks';

function Login() {
  const { message, show, clear } = useNetworkError();

  const onSubmit = async () => {
    try {
      await axios.post('/login', data);
    } catch (e) {
      show('로그인 중 네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <>
      로그인
      
    
  );
}
```

### 4. 입력 경고 스타일
```css
/* InputWarning.css */
.input-warning {
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
}
```
`` 컴포넌트는 `message`가 없으면 렌더를 생략합니다.

---

## 상세 API

### Redux Slice: `errorSlice`
| 상태 필드 | 용도 |
|-----------|------|
| `pageErrorCode` | 404‧500 등 페이지 전환용 코드 |
| `authError`, `networkError` … | 범주별 단일 문자열 |
| `inputErrors` | `{ [field]: msg }` map |
| `modal` | `{ isOpen, title, message, onConfirm, onCancel }` |

> 모든 액션은 `clearErrors(['key1','key2'])`로 부분 초기화 가능.

### 훅 모음: `useErrorHooks`
```ts
const { message, show, clear } = useNetworkError();
const { show: setPageCode } = usePageError();
```
`useInputError(field)`는 200 ms 디바운스로 대량 입력 시 성능을 확보합니다.

### 컴포넌트
| 이름 | 설명 |
|------|------|
| `ErrorModal` | React-Modal 래퍼, 버튼 2개(확인/취소) |
| `ErrorPage`  | `/error/:code` 경로에서 사용, `HTTP_ERROR_CODES` 매핑. |
| `ErrorBoundary` | 렌더 예외 → 모달 후 홈으로 이동. |
| `InputWarning`  | 필드 하단 작은 붉은 경고. |

### 유틸리티
- **filterProcess(raw)** : 민감정보 마스킹 → DOMPurify.  
- **requestHistory** : 마지막 GET 요청 url을 세션에 기록/복원.  
- **requestAllSettled** : `Promise.allSettled` 결과 중 실패만 모달.

---

## 커스터마이징

| 항목 | 방법 |
|------|------|
| HTTP 상태 메시지 | `components/errorCode.js` 수정 또는 추가 |
| 모달 테마 | `css/ErrorModal.css` 변수 및 색상 재정의. |
| 재시도 정책 | `api/interceptor.js` 의 `MAX_RETRIES`, `FIXED_DELAY_MS` 변경 |
| 민감정보 패턴 | `utils/filterProcess.js` 의 RegExp 확장 |
| WebSocket/Worker 예외 제목 | `SafeWebSocket`, `createSafeWorker` 내부 문자열 조정 |

---

## 라이선스
MIT License. 자세한 내용은 `LICENSE` 파일을 확인하세요.
