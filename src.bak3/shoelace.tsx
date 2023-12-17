import '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/themes/dark.css';

export const rootClassName = 'sl-theme-dark';

type Props<T> = {
  [K in keyof T as `${string & K}`]?: T[K];
};

declare module 'solid-js' {
  namespace JSX {
    type ElementProps<T> = {
      [K in keyof T]: HTMLAttributes<T[K]> &
        Omit<Props<T[K]>, keyof HTMLAttributes<T[K]>>;
    };

    interface IntrinsicElements extends ElementProps<HTMLElementTagNameMap> {}
  }
}
