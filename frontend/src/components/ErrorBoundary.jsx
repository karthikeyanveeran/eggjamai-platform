/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 */

import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content glass-panel">
            <div className="error-icon">😔</div>
            <h1 className="text-gradient">Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button 
                className="btn-primary"
                onClick={this.handleReset}
              >
                Try Again
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </button>
            </div>

            <p className="error-support">
              If this problem persists, please contact support at{' '}
              <a href="mailto:support@eggjamai.com">support@eggjamai.com</a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
