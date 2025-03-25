import { Icons } from '@headless-adminapp/icons';
import { Component, PropsWithChildren } from 'react';

import { ComponentBroken } from './ComponentBroken';

interface ErrorBoundaryProps {}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ComponentErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<ErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ComponentBroken Icon={Icons.Block} message="Component render failed" />
      );
    }

    return this.props.children;
  }
}
