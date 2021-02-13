import React, { useState, useLayoutEffect, useRef, useCallback } from "react";

const minArray = [...Array(1).keys()].map((i) => ({ index: i }));

export type useLazyGridProps = {
  size: number;
  gridRef: React.RefObject<HTMLElement>;
  estimateSize: number;
  overscan: number;
};

export default function useLazyGrid({
  size,
  gridRef,
  estimateSize,
  overscan = 5,
}: useLazyGridProps) {
  const windowHeight = window.innerHeight;

  const visibleRows = Math.floor(windowHeight / estimateSize) + overscan;

  const [visibleAmount, setVisibleAmount] = useState(0);

  const [childElementCount, setChildElementCount] = useState(0);

  const initVisible = useRef(0);

  useLayoutEffect(() => {
    if (gridRef.current) {
      const firstGridItem = gridRef.current.firstElementChild as HTMLElement;

      const columnCount = Math.floor(
        gridRef.current.offsetWidth / firstGridItem?.offsetWidth
      );

      const visibleItems = Number.isNaN(columnCount)
        ? 1
        : visibleRows * columnCount;

      initVisible.current = visibleItems;

      setVisibleAmount(Math.min(size, visibleItems));
    }
  }, [gridRef, visibleRows, size, gridRef.current?.firstElementChild]);

  const loadMore = useCallback(() => {
    setVisibleAmount((visibleAmount) => {
      const newVisible = visibleAmount + initVisible.current;

      if (newVisible >= size) {
        return size;
      }

      return visibleAmount + initVisible.current;
    });
  }, [size]);

  useLayoutEffect(() => {
    if (gridRef.current) {
      const lastGridItem = gridRef.current.lastElementChild;

      if (lastGridItem) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                loadMore();
              }
            });
          },
          {
            rootMargin: "50px 50px 50px 50px",
          }
        );

        observer.observe(lastGridItem);

        return () => observer.unobserve(lastGridItem);
      }
    }
    return undefined;
  }, [gridRef, childElementCount, loadMore]);

  useLayoutEffect(() => {
    if (gridRef.current) {
      const config = { childList: true, subtree: true };

      const callback: MutationCallback = function (mutationsList) {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            const element = mutation.target as HTMLElement;
            setChildElementCount(element.childElementCount);
          }
        }
      };

      const observer = new MutationObserver(callback);

      observer.observe(gridRef.current, config);

      return () => observer.disconnect();
    }
    return undefined;
  }, [gridRef, gridRef.current]);

  return size < visibleAmount
    ? minArray
    : [...Array(visibleAmount).keys()].map((i) => ({ index: i }));
}
