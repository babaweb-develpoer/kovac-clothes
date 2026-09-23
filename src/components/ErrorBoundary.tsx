import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Called once if a child throws during render/mount, so callers can fail
   * safe (e.g. skip a broken intro animation and reveal the page). */
  onError?: () => void;
};
type State = { hasError: boolean };

/**
 * Guards against a rare third-party animation-library exception thrown
 * synchronously during mount (e.g. a WAAPI keyframe edge case) so it can't
 * unmount and blank the entire page. Renders nothing further once caught —
 * the failure is deterministic for a given layout, so retrying the same
 * subtree would just throw again.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Recovered from a render error:", error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
