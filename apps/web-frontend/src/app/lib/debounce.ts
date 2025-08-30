export function debounce(fn: (...args: any[]) => any, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function debounceBoolean(fn: (trigger: boolean, ...args: any[]) => any, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (trigger: boolean, ...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    if (trigger) {
      timeoutId = setTimeout(() => fn(trigger, ...args), delay);
    }
  };
}
