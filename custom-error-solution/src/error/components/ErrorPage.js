import '../css/ErrorPage.css';
import { HTTP_ERROR_CODES } from './errorCode';
import { useState } from 'react';
import { ErrorModal } from './ErrorModal';
import { filterProcess } from '../utils/filterProcess'
import { getLastRequest, clearLastRequest } from '../utils/requestHistory';

export default function ErrorPage({ code = 500, onGoHome }) {
  const { title, message } = HTTP_ERROR_CODES[code] || {
    title: `${code} 알 수 없는 오류`,
    message: '알 수 없는 오류가 발생했습니다.',
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: '', message: '', onConfirm: null });

  const handleRefresh = () => {
    const req = getLastRequest() ?? {};
    if (req?.method !== 'GET') {
      setModalInfo({
        title: '이전 요청 재시도',
        message: '이전 요청 정보를 찾을 수 없어 홈으로 이동합니다.',
        onConfirm: () => onGoHome(),
      });
    } else {
      setModalInfo({
        title: '이전 페이지 다시 요청',
        message: '이전 페이지를 다시 요청하시겠습니까?',
        onConfirm: () => {
          clearLastRequest();
          window.location.href = req.url;
        },
      });
    }
    setModalOpen(true);
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-code">{code}</div>
        <h1 className="error-title">{title}</h1>
        <p className="error-description">{filterProcess(message)}</p>
        <div className="error-actions">
          <button className="home-button" onClick={onGoHome}>
            홈으로
          </button>
          <button className="refresh-button" onClick={handleRefresh}>
            다시 시도
          </button>
        </div>
        {modalOpen && (
          <ErrorModal
            isOpen
            title={modalInfo.title}
            message={modalInfo.message}
            onConfirm={modalInfo.onConfirm}
          />
        )}
      </div>
    </div>
  );
}