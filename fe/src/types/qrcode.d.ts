declare module 'qrcode' {
  interface Options {
    errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high';
    type?: 'image/png' | 'image/jpeg' | 'image/webp' | 'svg';
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: Options
  ): Promise<void>;

  function toDataURL(text: string, options?: Options): Promise<string>;

  export { toCanvas, toDataURL, Options };
}
