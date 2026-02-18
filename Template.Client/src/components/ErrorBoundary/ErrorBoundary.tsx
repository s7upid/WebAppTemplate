import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "../Button/Button";
import { env } from "@/utils";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.handleReset();
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.background}>
          <div className={styles.card}>
            <div className={styles.iconBg}>
              <AlertTriangle className={styles.icon} />
            </div>

            <div className={styles.content}>
              <h1 className={styles.title}>Something went wrong</h1>

              <p className={styles.description}>
                We're sorry, but something unexpected happened. Please try one
                of the options below.
              </p>

              {(env.VITE_ENVIRONMENT || this.props.showDetails) &&
                this.state.error && (
                  <details className={styles.details}>
                    <summary className={styles.detailsSummary}>
                      Error Details{" "}
                      {env.VITE_ENVIRONMENT == "Development"
                        ? "(Development)"
                        : ""}
                    </summary>
                    <div className={styles.detailsContent}>
                      <div className="error-details-error">
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className={styles.detailsPre}>
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

              <div className={styles.actions}>
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  icon={RefreshCw}
                >
                  Try Again
                </Button>

                <Button
                  onClick={this.handleRefresh}
                  variant="ghost"
                  icon={RefreshCw}
                >
                  Refresh Page
                </Button>

                <Button onClick={this.handleGoHome} variant="ghost" icon={Home}>
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
