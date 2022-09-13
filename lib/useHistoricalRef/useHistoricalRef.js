import React from "react";



const handler = {
  get(obj, key) {
    if (key === "current") {
      return obj.ref.current;
    } else if (key === "last") {
      return obj.last.current;
    } else {
      return false;
    }
  },
  set(obj, key, value) {
    if (key === "current") {
      obj.last.current.push(obj.ref.current);
      obj.ref.current = value;
      return true;
    } else {
      return false;
    }
  }
};

export default function useHistoryRef(defaultValue) {
  const ref = React.useRef(defaultValue);
  const last = React.useRef([defaultValue]);
  const func = function(value) {
    last.current.push(ref.current);
    ref.current = value;
  }
  func.ref = ref;
  func.last = last;
  return new Proxy(func, handler);
}
