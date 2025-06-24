// src/components/ErrorModal.js
import ReactModal from 'react-modal';
import '../css/ErrorModal.css';

ReactModal.setAppElement('#root');

export function ErrorModal({ isOpen, title, message, onConfirm, onCancel }) {
  return (
    <ReactModal
      isOpen={isOpen}
      className="error-modal"
      overlayClassName="error-modal__overlay"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div className="error-modal__header">
        <h2>{title}</h2>
      </div>
      <div className="error-modal__body">
        <p>{message}</p>
      </div>
      <div className="error-modal__footer">
        <button className="error-modal__btn error-modal__btn--primary" onClick={onConfirm}>
          확인
        </button>
        <button className="error-modal__btn error-modal__btn--sub" onClick={onCancel}>
          취소
        </button>
      </div>
    </ReactModal>
  );
}