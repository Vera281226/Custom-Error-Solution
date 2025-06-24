import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './error/redux/store';
import { ErrorBoundary } from './error/components/ErrorBoundary';
import { ErrorModal } from './error/components/ErrorModal';
import ErrorPage from './error/components/ErrorPage';
import { HTTP_ERROR_CODES } from './error/components/errorCode';
import { useNetworkError } from './error/hook/useErrorHooks';
import { closeModal } from './error/redux/errorSlice';
import axios from './error/api/interceptor';


/* ---------- 최상위 ---------- */
function App() {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Router>
    </Provider>
  );
}

/* ---------- 라우트 ---------- */
function AppRoutes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clear: clearNetErr } = useNetworkError();

  /* 전역 모달 상태 */
  const modal = useSelector(state => state.error.modal);
  const handleClose = () => dispatch(closeModal());

  /* HTTP 코드별 에러 페이지 */
  const ErrorPageRoute = () => {
    const { code } = useParams();
    return (
      <ErrorPage
        code={parseInt(code ?? '500', 10)}
        onGoHome={() => navigate('/')}
      />
    );
  };

  /* ---------- 메인 화면 ---------- */
  const Main = () => {
    const [localModal, setLocalModal] = useState(null);

    /* 1) 렌더 오류 유발 */
    const throwError = () => {
      throw new Error('고의 JS 예외 발생');
    };

    /* 2) HTTP 상태 코드 페이지 이동 */
    const goErrorPage = c => navigate(`/error/${c}`);

    /* 3) 안내 모달(개인정보·약관) */
    const infoModal = type => {
      const map = {
        privacy: { title: '개인정보 처리방침', message: '내용...' },
        terms:   { title: '이용 약관',         message: '내용...' },
      };
      setLocalModal({
        ...map[type],
        onConfirm: () => setLocalModal(null),
        onCancel:  () => setLocalModal(null),
      });
    };

    /* 5) 비동기 요청 테스트 */
    const asyncTest = async method => {
      try {
        await axios({ url: 'https://httpstat.us/500', method });
        setLocalModal({
          title: `${method} 요청 성공`,
          message: '서버 응답이 정상적으로 완료되었습니다.',
          onConfirm: () => setLocalModal(null),
          onCancel:  () => setLocalModal(null),
        });
      } catch {}
    };

    /* ---------- 화면 ---------- */
    return (
      <div style={{ padding: '2rem' }}>
        <h2>에러 처리 예제</h2>

        <section>
          <h3>1. 렌더 예외 테스트</h3>
          <button onClick={throwError}>JS 예외 발생</button>
        </section>

        <section>
          <h3>2. HTTP 에러 코드 테스트</h3>
          {Object.keys(HTTP_ERROR_CODES).map(code => (
            <button key={code} onClick={() => goErrorPage(code)} style={{ margin: 4 }}>
              {code} 에러
            </button>
          ))}
        </section>

        <section>
          <h3>3. 비동기 요청 테스트</h3>
          {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
            <button key={m} onClick={() => asyncTest(m)} style={{ margin: 4 }}>
              {m} 요청
            </button>
          ))}
          <button onClick={clearNetErr} style={{ margin: 4 }}>
            네트워크 에러 초기화
          </button>
        </section>

        <section>
          <h3>4. 추가 안내 모달</h3>
          <button onClick={() => infoModal('privacy')} style={{ margin: 4 }}>
            개인정보 보기
          </button>
          <button onClick={() => infoModal('terms')} style={{ margin: 4 }}>
            약관 보기
          </button>
        </section>

        {localModal && (
          <ErrorModal
            isOpen
            title={localModal.title}
            message={localModal.message}
            onConfirm={localModal.onConfirm}
            onCancel={localModal.onCancel}
          />
        )}
      </div>
    );
  };

  /* ---------- 렌더 ---------- */
  return (
    <>
      {modal.isOpen && (
        <ErrorModal
          isOpen
          title={modal.title}
          message={modal.message}
          onConfirm={() => { modal.onConfirm?.(); handleClose(); }}
          onCancel={()  => { modal.onCancel?.();  handleClose(); }}
        />
      )}

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/error/:code" element={<ErrorPageRoute />} />
      </Routes>
    </>
  );
}

export default App;
