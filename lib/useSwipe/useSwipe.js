import { useState, useEffect, useRef } from "react";
import useHistoryRef from "@oriun/use-historical-ref";


const createThrottle = function (
  callback,
  delay
) {
  const ArgumentStack = [];
  let promise = null;
  async function push(args) {
    ArgumentStack.push(args);
    if (!promise) {
      promise = new Promise((r) => {
        setTimeout(() => {
          ArgumentStack.length &&
            callback(ArgumentStack.splice(0, ArgumentStack.length));
          promise = null;
          r();
        }, delay);
      });
      return promise;
    } else {
      return promise;
    }
  }
  async function flush() {
    ArgumentStack.length &&
      callback(ArgumentStack.splice(0, ArgumentStack.length));
  }
  return { push, flush };
};

export const DIRECTIONS = {
  Horizontal : 0,
  Vertical : 1
}

export default function useSwipe({
  direction = DIRECTIONS.Horizontal,
  minThreeshold = 3,
  ratio = 3,
  onMove = null,
  onCancel = null,
  activated = true,
  fps = 60
})
{
  const [start, setStart] = useState(null);
  const ref = useHistoryRef(null);
  const lastDelta = useHistoryRef(0);
  const onMoveRef = useRef(onMove);
  const onMoveThrottle = useRef(
    createThrottle((data) => {
      const { element, start, end } = data.at(-1);
      const { current, end: e0 } = data[0];
      onMoveRef.current?.({ element, start, current: end - e0 + current, end });
    }, 1000 / fps)
  );
  useEffect(() => {
    onMoveRef.current = onMove;
  }),
    [onMove];
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  }),
    [onCancel];

  useEffect(() => {
    if ((ref.current && ref.last.at(-1) === ref.current) || !ref.current) return;
    const currentRef = ref.current;
    function defineStart(event) {
      if (event.touches.length !== 1) return;
      lastDelta.current = 0;
      activated &&
        setStart({
          x: event.touches[0].pageX,
          y: event.touches[0].pageY
        });
    }
    currentRef.addEventListener("touchstart", defineStart);
    return () => {
      currentRef.removeEventListener("touchstart", defineStart);
    };
  }, [ref.current]);

  useEffect(() => {
    if (!start) return;
    const currentRef = ref.current;

    function cancel() {
      setStart(null);
      onMoveThrottle.current.flush();
      if (!lastDelta.current) return;
      activated &&
        onCancelRef.current?.({ element: currentRef, end: lastDelta });
    }

    function handleMove(event) {
      const current = {
        x: event.touches[0].pageX - start.x,
        y: event.touches[0].pageY - start.y
      };

      const computedRatio = Math.abs(current.x) / Math.abs(current.y);
      if (computedRatio > (1 / ratio) && computedRatio < ratio) return;

      const currentDirection = computedRatio > ratio ? 0 : 1;

      if (currentDirection !== direction) return;
      const axe = direction ? "y" : "x";
      const delta = Math.abs(current[axe] - start[axe]);
      if (delta < minThreeshold) return;
      activated &&
        onMoveThrottle.current.push({
          element: currentRef,
          start: start[axe],
          current: current[axe] - lastDelta.current,
          end: current[axe]
        });
      lastDelta.current = current[axe];
    }
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", cancel);
    window.addEventListener("touchcancel", cancel);
    return () => {
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", cancel);
      window.removeEventListener("touchcancel", cancel);
    };
  }, [start, ref.current]);

  return ref;
}
