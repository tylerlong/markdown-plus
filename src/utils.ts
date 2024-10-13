const animateDivScroll = (
  target: HTMLDivElement,
  targetScrollTop: number,
  duration: number,
) => {
  const startScrollTop = target.scrollTop;
  const change = targetScrollTop - startScrollTop;
  const startTime = performance.now();

  function animate(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const newScrollTop = startScrollTop + change * progress;
    target.scrollTop = newScrollTop;

    if (timeElapsed < duration) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
};

const animateCodeMirrorScroll = (
  target: CodeMirror.Editor,
  targetScrollTop: number,
  duration: number,
) => {
  const startScrollTop = target.getScrollInfo().top;
  const change = targetScrollTop - startScrollTop;
  const startTime = performance.now();

  function animate(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const newScrollTop = startScrollTop + change * progress;
    target.scrollTo(null, newScrollTop);

    if (timeElapsed < duration) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
};

export const animateScroll = (
  target: HTMLDivElement | CodeMirror.Editor,
  targetScrollTop: number,
  duration: number,
) => {
  if (target instanceof HTMLDivElement) {
    animateDivScroll(target, targetScrollTop, duration);
  } else {
    animateCodeMirrorScroll(target, targetScrollTop, duration);
  }
};
