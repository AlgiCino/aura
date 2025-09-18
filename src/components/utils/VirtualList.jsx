import React from "react";

export default function VirtualList({
  items = [],
  itemHeight = 40,
  height = 300,
  overscan = 6,
  renderItem
}) {
  const containerRef = React.useRef(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const onScroll = (e) => setScrollTop(e.currentTarget.scrollTop);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height }}
      className="overflow-auto"
      role="list"
      aria-label="Virtualized list"
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {items.slice(startIndex, endIndex).map((item, i) =>
            <div key={startIndex + i} style={{ height: itemHeight }} role="listitem">
              {renderItem({ item, index: startIndex + i })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}