import store from '../redux/store';
import { openModal, closeModal } from '../redux/errorSlice';
import { filterProcess } from './filterProcess.js';

/**
 * 공통 모달 디스패처
 * @param {string} title
 * @param {string} rawMsg
 */
function dispatchModal(title, rawMsg) {
  const safe = filterProcess(String(rawMsg));
  store.dispatch(
    openModal({
      title,
      message: safe,
      onConfirm: () => {
        store.dispatch(closeModal());
        window.dispatchEvent(new CustomEvent('navigate-home'));
      },
      onCancel: () => store.dispatch(closeModal()),
    }),
  );
}

/* 동기 런타임·이벤트 핸들러 오류 */
window.addEventListener('error', e => {
  dispatchModal('런타임 오류', e.error?.message || e.message || '알 수 없는 오류');
});

/* Unhandled Promise Rejection */
window.addEventListener('unhandledrejection', e => {
  dispatchModal('비동기 처리 오류', e.reason?.message || e.reason || '알 수 없는 오류');
});
