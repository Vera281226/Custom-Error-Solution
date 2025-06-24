import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * 에러 훅 생성 팩토리
 * @param {Function} selector - 상태 선택자
 * @param {Function} showAction - 에러 설정 액션
 * @param {Function} clearAction - 에러 초기화 액션
 * @param {number} debounceTime - 디바운스 시간(ms)
 * @returns {Function} 커스텀 훅
 */
export function createErrorHook(selector, showAction, clearAction, debounceTime = 0) {
  return function useError() {
    const dispatch = useDispatch();
    const errorMsg = useSelector(selector);
    const debounced = useDebouncedCallback(
      msg => dispatch(showAction(msg)),
      debounceTime
    );
    const show = debounceTime > 0 ? debounced : msg => dispatch(showAction(msg));
    const clear = useCallback(() => {
      dispatch(clearAction());
    }, [dispatch]);

    return { message: errorMsg, show, clear };
  };
}
