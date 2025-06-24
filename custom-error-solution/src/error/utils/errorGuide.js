export const ERROR_GUIDE = {
  NETWORK_ERROR: {
    title: '네트워크 연결 오류',
    message: '인터넷 연결 상태를 확인한 후 다시 시도해주세요.',
  },
  TIMEOUT: {
    title: '요청 시간 초과',
    message: '서버 응답이 지연되었습니다. 잠시 후 다시 시도해주세요.',
  },
  CORS_ERROR: {
    title: 'CORS 오류',
    message: '리소스 접근 권한이 없습니다. 관리자에게 문의하세요.',
  },
  SERVER_DOWN: {
    title: '서버 연결 실패',
    message: '서버가 응답하지 않습니다. 잠시 후 재시도해주세요.',
  },
  WEBSOCKET_ERROR: {
    title: 'WebSocket 오류',
    message: '실시간 연결에 문제가 발생했습니다. 네트워크 상태를 확인하고 다시 시도하세요.',
  },
  WORKER_ERROR: {
    title: '백그라운드 작업 오류',
    message: '백그라운드 처리 중 문제가 발생했습니다. 페이지를 새로고침해주세요.',
  },
};