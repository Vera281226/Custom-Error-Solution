import DOMPurify from 'dompurify';

/* 1) 민감 정보 마스킹 */
function filterSensitiveInfo(msg) {
  if (typeof msg !== 'string') return '알 수 없는 오류가 발생했습니다.';
  return msg
    .replace(/token=[^\s&]+/gi, 'token=[FILTERED]')
    .replace(/user_id=\d+/gi, 'user_id=[FILTERED]');
}

/* 2) 최종 정제 */
export function filterProcess(raw) {
  return DOMPurify.sanitize(filterSensitiveInfo(String(raw)));
}