import axios from 'axios';
import store from '../redux/store';
import { openModal, closeModal } from '../redux/errorSlice';
import { saveLastRequest } from '../utils/requestHistory';
import { filterProcess } from '../utils/filterProcess';

/* ──────────────────────────────────────────────
   Axios 전역 인터셉터 + 고정 딜레이 재시도 구현
─────────────────────────────────────────────── */

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

/* 재시도 설정 */
const MAX_RETRIES = 3;
const FIXED_DELAY_MS = 333; // 1초 내 3회 재시도를 위한 고정 딜레이 (1000ms / 3 ≈ 333ms)

/**
 * 재시도 대상 여부
 *  - 네트워크 오류(응답 객체 없음)
 *  - 5xx · 408 · 429 상태코드
 */
function shouldRetry(error) {
  if (!error.response) return true;
  const status = error.response.status;
  return status >= 500 || status === 408 || status === 429;
}

axios.defaults.withCredentials = true;

/* 요청 인터셉터 */
axios.interceptors.request.use(config => {
  const csrf = getCsrfToken();
  if (csrf) config.headers['X-XSRF-TOKEN'] = csrf;
  saveLastRequest({ method: config.method, url: config.url });
  return config;
});

/* 응답 인터셉터 */
axios.interceptors.response.use(
  response => response,
  error => {
    const config = error.config || {};

    /* ───── 고정 딜레이 재시도 로직 ───── */
    if (shouldRetry(error) && config) {
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        
        // 고정 딜레이 적용 (333ms)
        const delay = FIXED_DELAY_MS;

        return new Promise(resolve =>
          setTimeout(() => resolve(axios(config)), delay)
        );
      }
    }

    /* 한계 초과 → 사용자 알림 */
    const status = error.response?.status;
    const rawMsg = error.response?.data?.message ?? error.message;
    const safeMsg = filterProcess(rawMsg);

    store.dispatch(
      openModal({
        title: `오류 코드 ${status || '??'}`,
        message: safeMsg,
        onConfirm: () => {
          store.dispatch(closeModal());
          window.dispatchEvent(new CustomEvent('navigate-home'));
        },
        onCancel: () => store.dispatch(closeModal()),
      }),
    );

    return Promise.reject(error);
  },
);

export default axios;