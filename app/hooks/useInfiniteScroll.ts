import { useEffect, useState } from "react";

export function useInfiniteScroll(totalLength: number, pageSize: number) {
  const [visible, setVisible] = useState(Math.min(pageSize, totalLength));
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(Math.min(pageSize, totalLength));
  }, [totalLength, pageSize]);

  useEffect(() => {
    if (visible >= totalLength) return;
    if (!sentinelEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + pageSize, totalLength));
        }
      },
    );
    io.observe(sentinelEl);
    return () => io.disconnect();
  }, [visible, totalLength, sentinelEl, pageSize]);

  const hasMore = visible < totalLength;

  return { visible, hasMore, setSentinelEl, setVisible };
}
