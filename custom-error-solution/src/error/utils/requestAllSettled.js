import axios from 'axios';
import store from '../redux/store';
import { openModal, closeModal } from '../redux/errorSlice';
import { filterProcess } from './filterProcess';

/* 병렬 요청 개별 처리용 Promise.allSettled 유틸리티[20] */
export function requestAllSettled(requestConfigs = []) {
  const jobs = requestConfigs.map(cfg =>
    typeof cfg === 'function' ? axios(cfg()) : axios(cfg)
  );

  return Promise.allSettled(jobs).then(results => {
    results.forEach(result => {
      if (result.status === 'rejected') {
        const rawMsg =
          result.reason?.response?.data?.message ||
          result.reason?.message ||
          '알 수 없는 오류';
        const safeMsg = filterProcess(rawMsg);

        store.dispatch(
          openModal({
            title: '병렬 요청 오류',
            message: safeMsg,
            onConfirm: () => store.dispatch(closeModal()),
            onCancel: () => store.dispatch(closeModal()),
          }),
        );
      }
    });

    return results; // 호출 측에서 결과 배열 활용
  });
}