export function preventDefault(callback, ...args) {
  return function handler(event) {
    event.preventDefault();
    typeof callback === 'function' && callback(...args, event);
  };
}

export function stopPropagation(callback, ...args) {
  return function handler(event) {
    event.stopPropagation();
    typeof callback === 'function' && callback(...args, event);
  };
}
