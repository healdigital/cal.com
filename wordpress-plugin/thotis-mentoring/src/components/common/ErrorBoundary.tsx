import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="th-rounded-lg th-border th-border-red-200 th-bg-red-50 th-p-6 th-text-center">
          <p className="th-text-red-700 th-font-medium">Une erreur est survenue</p>
          <p className="th-mt-2 th-text-sm th-text-red-600">{this.state.error?.message}</p>
          <button
            type="button"
            className="th-mt-4 th-rounded th-bg-thotis-blue th-px-4 th-py-2 th-text-sm th-text-white hover:th-bg-thotis-blue-dark"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
