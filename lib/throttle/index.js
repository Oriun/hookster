const createThrottle = (callback, delay) => {
  const ArgumentStack = [];
  const PromiseStack = [];
  let promise = null;
  return function throttle(...args) {
    return new Promise((resolve) => {
      ArgumentStack.push(args);
      PromiseStack.push(resolve);
      if (!promise) {
        promise = new Promise((resolve2) => {
          setTimeout(() => {
            callback(
              ArgumentStack.splice(0, ArgumentStack.length),
              PromiseStack.splice(0, PromiseStack.length)
            );
            promise = null;
            resolve2();
          }, delay);
        });
        return promise;
      }
      return promise;
    });
  };
};

export default createThrottle;
