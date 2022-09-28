const { useState, useEffect, useRef } = require("react");

const translateToPixel = (string) => {
  // NOW => only handle pixels value
  // NEXT => handle viewport units
  return parseFloat(string);
};

const isTrue = (mediaquery, element) => {
  const queries = mediaquery.split("and");
  for (const query of queries) {
    let q = query.replace(/[() ]/gim, "");
    if (!q.includes(":")) throw new Error("Unsupported query " + q);
    const [type, value] = q.split(/ *: */);
    const pixels = translateToPixel(value);
    switch (type) {
      case "max-width": {
        if (element.inlineSize > pixels) return false;
        break;
      }
      case "min-width": {
        if (element.inlineSize < pixels) return false;
        break;
      }
      case "max-height": {
        if (element.blockSize > pixels) return false;
        break;
      }
      case "min-height": {
        if (element.blockSize < pixels) return false;
        break;
      }
      default:
        throw new Error("unsupported query " + type);
    }
  }
  return true;
};

/**
 *
 * @param {Object<string, string>} queries
 * @param {HTMLElement | Node} element
 * @returns {Object<string, boolean>}
 */
const useMedia = (queries) => {
  const [execQueries, setExecQueries] = useState(
    Object.fromEntries(Object.keys(queries).map((key) => [key, false]))
  );

  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;

    let obs = new ResizeObserver(([{ borderBoxSize, contentRect }]) => {
      const newRes = { ...execQueries };
      let hasChanged = false;
      for (const name in queries) {
        let mediaquery = queries[name];
        if (typeof mediaquery === "number") {
          mediaquery = `min-width: ${mediaquery}px`;
        }
        let s = isTrue(
          mediaquery,
          borderBoxSize?.[0] || borderBoxSize || contentRect
        );
        if (newRes[name] !== s) {
          hasChanged = true;
          newRes[name] = s;
        }
      }
      if (hasChanged) setExecQueries(newRes);
    });

    ref.current && obs.observe(ref.current);

    return () => {
      if (ref.current instanceof HTMLElement)
        try {
          obs.unobserve(ref.current);
        } catch (err) {}
      obs.disconnect();
    };
  }, [ref.current, execQueries]);

  return [execQueries, ref];
};

module.exports = { useMedia };
