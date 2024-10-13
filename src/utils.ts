export const animate = (
  move: (i: number) => void,
  start: number,
  end: number,
  duration: number,
) => {
  const startTime = performance.now();
  const animate = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    move(start + (end - start) * Math.min(timeElapsed / duration, 1));
    if (timeElapsed < duration) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
};
