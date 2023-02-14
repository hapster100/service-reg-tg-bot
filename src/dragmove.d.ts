declare namespace svelte.JSX {
  interface HTMLProps<T> {
    ondragmove?: (e: CustomEvent) => void;
  }
}
