import { createSignal } from 'solid-js';

export function useStack<T>(length: number, initialEntry?: T) {
  const [stack, setStack] = createSignal<T[]>(
    initialEntry === undefined ? [] : [initialEntry],
  );

  return [stack, push] as const;

  function push(value: T) {
    setStack([value, ...stack().slice(0, length - 1)]);
  }
}
