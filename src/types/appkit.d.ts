declare namespace JSX {
  interface IntrinsicElements {
    "appkit-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      open?: () => void;
    };
  }
}

export interface AppKitButtonElement extends HTMLElement {
  open: () => void;
}
