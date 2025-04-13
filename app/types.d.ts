import type { ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  type ChildrenProp = {
    children?: ReactNode;
  };
}
