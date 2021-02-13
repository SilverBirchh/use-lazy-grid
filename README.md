# use-lazy-grid

> Lazily render a list of items

[![NPM](https://img.shields.io/npm/v/use-lazy-grid.svg)](https://www.npmjs.com/package/use-lazy-grid) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Take a long list of flex or grid items and lazy load them in to the DOM with ease.

## Install

```bash
npm install --save use-lazy-grid
```

## Usage

```tsx
import React, { useRef } from "react";

import useLazyGrid from "use-lazy-grid";

const items = new Array(10000).fill(0);

const App = () => {
  const parentRef = useRef(null);

  const visible = useLazyGrid({
    size: items.length,
    gridRef: parentRef,
    estimateSize: 100,
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
      }}
      ref={parentRef}
    >
      {visible.map(({ index }) => {
        return (
          <div
            key={index}
            style={{
              height: 100,
              borderRadius: 5,
              backgroundColor: "#F56565",
            }}
          />
        );
      })}
    </div>
  );
};
```

## License

MIT © [SilverBirchh](https://github.com/SilverBirchh)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
