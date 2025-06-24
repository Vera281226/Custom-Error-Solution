import store from '../redux/store';
import { openModal, closeModal } from '../redux/errorSlice';
import { filterProcess } from '../utils/filterProcess'
/**
 * WebSocket 오류를 전역 파이프라인으로 전달하는 래퍼
 */
export default class SafeWebSocket {
  /**
   * @param {string} url
   * @param {string|string[]} [protocols]
   */
  constructor(url, protocols) {
    this.socket = new WebSocket(url, protocols);

    this.socket.onerror = ev => {
      const msg = ev.message || 'WebSocket 오류가 발생했습니다.';
      this.#showModal('WebSocket 오류', msg);
    };

    /* 비정상 종료(1000 이외) 감지 */
    this.socket.onclose = ev => {
      if (ev.code !== 1000) {
        const msg = ev.reason || 'WebSocket 연결이 비정상적으로 종료되었습니다.';
        this.#showModal(`WebSocket 종료 (${ev.code})`, msg);
      }
    };
  }

  /* ─────── Proxy 메서드 ─────── */
  send(...args) {
    this.socket.send(...args);
  }
  addEventListener(...args) {
    this.socket.addEventListener(...args);
  }
  removeEventListener(...args) {
    this.socket.removeEventListener(...args);
  }
  close(...args) {
    this.socket.close(...args);
  }
  get readyState() {
    return this.socket.readyState;
  }

  /* ─────── 내부 헬퍼 ─────── */
  #showModal(title, rawMsg) {
    const safe = filterProcess(rawMsg);
    store.dispatch(
      openModal({
        title,
        message: safe,
        onConfirm: () => store.dispatch(closeModal()),
        onCancel: () => store.dispatch(closeModal()),
      }),
    );
  }
}