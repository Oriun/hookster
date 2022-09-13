# @oriun/use-media

A React hook to implement component-level media queries and size changes in JavaScript.

> Works with pixel-based breakpoints only for now.

## Installation

```bash
npm install @oriun/use-media
```

## Usage

Attach the ref on the container you want to track then render the children based on the media query.

```jsx
import React from "react";
import useMedia from "@oriun/use-media";

// Define breakpoints with css-like syntax
const breakpoints = {
  mobile: "max-width: 450px",
  tablet: "(min-width: 451px) and (max-width: 1024px)",
  desktop: "min-width: 1025px"
};

const App = () => {
  // Get the current breakpoint status
  const [{ mobile, tablet, desktop }, ref] = useMedia(breakpoints);

  // Render your app based on
  return (
    <div ref={ref}>
      <h1>Current breakpoint:</h1>
      {mobile && <p>Mobile</p>}
      {tablet && <p>Tablet</p>}
      {desktop && <p>Desktop</p>}
    </div>
  );
};

export default App;
```

You can also pass and object with numbers as values to use the `min-width` media query.

```js
const breakpoints = {
  mobile: 0, // equivalent to "min-width: 0px"
  tablet: 450, // equivalent to "min-width: 450px"
  desktop: 1024 // equivalent to "min-width: 1024px"
};
```

## Caveats

- The hook will only work with pixel-based breakpoints for now.
- At the first render, all breakpoints will be evaluated as false since the ref is not yet allocated.
- The queries implement the `min-width`, `max-width`, `min-height`, `max-height` and the `and` keywords
