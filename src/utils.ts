export const animate = (
  move: (i: number) => void,
  start: number,
  end: number,
  duration: number,
) => {
  const startTime = performance.now();
  const animate = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    if (timeElapsed < 0) {
      return requestAnimationFrame(animate);
    }
    // line number should be integer
    const target = Math.round(
      start + (end - start) * Math.min(timeElapsed / duration, 1),
    );
    move(target);
    if (timeElapsed < duration) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
};
