
import React from 'react';
import { ErrorModal } from './ErrorModal';
import { filterProcess } from '../utils/filterProcess'
import { flushSync } from 'react-dom';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, errorMsg: '' };

  componentDidMount() {
    window.addEventListener('navigate-home', this.handleNavigate);
  }

  componentWillUnmount() {
    window.removeEventListener('navigate-home', this.handleNavigate);
  }

  static getDerivedStateFromError() {
    return { hasError: true, errorMsg: '' };
  }

  componentDidCatch(error, info) {
    const rawMsg = error.message || (info.componentStack || '').trim();
    const safeMsg = filterProcess(rawMsg);
    this.setState({ errorMsg: safeMsg });
  }

  handleAction = () => {
    window.dispatchEvent(new Event('navigate-home'));
  };

  handleNavigate = () => {
    flushSync(() => this.setState({ hasError: false, errorMsg: '' }));
    this.props.history?.replace?.('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorModal
          isOpen
          title="오류가 발생했습니다"
          message={this.state.errorMsg}
          onConfirm={this.handleAction}
          onCancel={this.handleAction}
        />
      );
    }
    return this.props.children;
  }
}