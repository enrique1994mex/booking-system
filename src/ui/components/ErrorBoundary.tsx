"use client";

import { Component, ReactNode } from "react";
import { ErrorResult } from "./ErrorResult";

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Replace with Sentry.captureException(error) in production
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorResult
          error={{ code: "UNKNOWN", message: "Something went wrong. Please refresh the page." }}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}
