import React from "react";


const useBounds = function({
  defaultValue,
  max = 100,
  min = 0
}) {
  const [n, s] = React.useState(defaultValue ?? min);
  const set = React.useCallback((v) => {
    const value = typeof v === "function" ? v(n) : v;
    if(Number.isNaN(value)) return
    if (value > max) {
      s(max);
    } else if (value < min) {
      s(min);
    } else {
      s(value);
    }
  },[n, s, max, min]);
  return [n, set];
};

export default useBounds;
