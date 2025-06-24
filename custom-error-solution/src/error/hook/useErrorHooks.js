import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  setNetworkError,
  setAuthError,
  setGlobalError,
  setInputError,
  setPageErrorCode,
  setWebsocketError,
  setWorkerError,
  clearErrors,
} from '../redux/errorSlice';

/* 네트워크 오류 */
export const useNetworkError = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.error.networkError);
  const show = msg => dispatch(setNetworkError(msg));
  const clear = useCallback(() => {
    dispatch(clearErrors(['networkError']));
  }, [dispatch]);
  return { message, show, clear };
};

/* 인증 오류 */
export const useAuthError = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.error.authError);
  const show = msg => dispatch(setAuthError(msg));
  const clear = useCallback(() => {
    dispatch(clearErrors(['authError']));
  }, [dispatch]);
  return { message, show, clear };
};

/* 전역 오류 */
export const useGlobalError = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.error.globalError);
  const show = msg => dispatch(setGlobalError(msg));
  const clear = useCallback(() => {
    dispatch(clearErrors(['globalError']));
  }, [dispatch]);
  return { message, show, clear };
};

/* WebSocket 오류 */
export const useWebsocketError = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.error.websocketError);
  const show = msg => dispatch(setWebsocketError(msg));
  const clear = useCallback(() => {
    dispatch(clearErrors(['websocketError']));
  }, [dispatch]);
  return { message, show, clear };
};

/* Worker 오류 */
export const useWorkerError = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.error.workerError);
  const show = msg => dispatch(setWorkerError(msg));
  const clear = useCallback(() => {
    dispatch(clearErrors(['workerError']));
  }, [dispatch]);
  return { message, show, clear };
};

/* 입력 유효성 오류 (디바운스 200ms) */
export const useInputError = field => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.error.inputErrors[field] || '');
  const debounced = useDebouncedCallback(
    msg => dispatch(setInputError({ field, msg })),
    200,
  );
  const show = msg => debounced(msg);
  const clear = useCallback(() => {
    dispatch(clearErrors([`inputErrors.${field}`]));
  }, [dispatch, field]);
  return { message, show, clear };
};

/* 페이지 오류(404/500 등) */
export const usePageError = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.error.pageErrorCode);
  const show = code => dispatch(setPageErrorCode(code));
  const clear = useCallback(() => {
    dispatch(clearErrors(['pageErrorCode']));
  }, [dispatch]);
  return { message, show, clear };
};