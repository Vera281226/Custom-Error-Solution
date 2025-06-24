import store from '../redux/store';
import { openModal, closeModal } from '../redux/errorSlice';
import { filterSensitiveInfo } from './filterSensitiveInfo';
import { sanitize } from './sanitize';

/**
 * 안전한 Worker 인스턴스 생성
 * @param {string} url  Worker 스크립트 경로
 * @param {WorkerOptions} [options]
 * @returns {Worker}
 */
export function createSafeWorker(url, options) {
  const worker = new Worker(url, options);

  /* Worker 전역 오류 */
  worker.addEventListener('error', e => {
    const safe = sanitize(filterSensitiveInfo(e.message || 'Worker 오류'));
    store.dispatch(
      openModal({
        title: '백그라운드 작업 오류',
        message: safe,
        onConfirm: () => store.dispatch(closeModal()),
        onCancel: () => store.dispatch(closeModal()),
      }),
    );
  });

  return worker;
}