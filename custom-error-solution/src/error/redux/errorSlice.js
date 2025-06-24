import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageErrorCode: null,
  authError: '',
  networkError: '',
  websocketError: '',
  workerError: '',
  globalError: '',
  inputErrors: {},
  modal: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  },
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setPageErrorCode(state, { payload }) {
      state.pageErrorCode = payload;
    },
    setAuthError(state, { payload }) {
      state.authError = payload;
    },
    setNetworkError(state, { payload }) {
      state.networkError = payload;
    },
    setWebsocketError(state, { payload }) {
      state.websocketError = payload;
    },
    setWorkerError(state, { payload }) {
      state.workerError = payload;
    },
    setGlobalError(state, { payload }) {
      state.globalError = payload;
    },
    setInputError(state, { payload: { field, msg } }) {
      state.inputErrors[field] = msg;
    },
    openModal(state, { payload }) {
      state.modal = {
        isOpen: true,
        title: payload.title,
        message: payload.message,
        onConfirm: payload.onConfirm,
        onCancel: payload.onCancel,
      };
    },
    closeModal(state) {
      state.modal = { ...initialState.modal };
    },
    clearAllErrors(state) {
      Object.assign(state, initialState);
    },
    clearErrors(state, { payload: keys }) {
      keys.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(initialState, key)) {
          state[key] = JSON.parse(JSON.stringify(initialState[key]));
        }
      });
    },
  },
});

export const {
  setPageErrorCode,
  setAuthError,
  setNetworkError,
  setWebsocketError,
  setWorkerError,
  setGlobalError,
  setInputError,
  openModal,
  closeModal,
  clearAllErrors,
  clearErrors,
} = errorSlice.actions;

export default errorSlice.reducer;