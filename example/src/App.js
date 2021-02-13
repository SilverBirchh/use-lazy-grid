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

export default App;
