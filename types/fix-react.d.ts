/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace React {
    type ReactNode = import("react").ReactNode;
  }
}

export {};

