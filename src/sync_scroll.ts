import debounce from 'debounce';

import store from './store';
import { animate } from './utils';

type IScroll = {
  lastMarker: number;
  nextMarker: number;
  percentage: number;
};

let scrollingSide = null;
let timeoutHandle = null;
const scrollSide = (side: 'left' | 'right', howToScroll): void => {
  if (scrollingSide !== null && scrollingSide !== side) {
    return; // the other side hasn't finished scrolling
  }
  scrollingSide = side;
  clearTimeout(timeoutHandle);
  timeoutHandle = setTimeout(() => {
    scrollingSide = null;
  }, 512);
  howToScroll();
};

const scrollLeft = (scrollTop: number): void => {
  scrollSide('left', () => {
    animate(
      (i) => store.editor.scrollTo(null, i),
      store.editor.getScrollInfo().top,
      scrollTop,
      128,
    );
  });
};

const scrollRight = (scrollTop: number): void => {
  scrollSide('right', () => {
    const element = document.getElementById('right-panel');
    animate((i) => (element.scrollTop = i), element.scrollTop, scrollTop, 128);
  });
};

const getEditorScroll = (): IScroll => {
  const lineMarkers = document.querySelectorAll(
    '#preview > [data-source-line]',
  );
  const lines: number[] = [];
  lineMarkers.forEach((element: HTMLElement) => {
    lines.push(parseInt(element.dataset.sourceLine, 10));
  });
  const currentPosition = store.editor.getScrollInfo().top;
  let lastMarker: number;
  let nextMarker: number;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const height = store.editor.heightAtLine(line - 1, 'local');
    if (height < currentPosition) {
      lastMarker = line;
    } else {
      nextMarker = line;
      break;
    }
  }
  let percentage = 0;
  if (lastMarker && nextMarker && lastMarker !== nextMarker) {
    percentage =
      (currentPosition - store.editor.heightAtLine(lastMarker - 1, 'local')) /
      (store.editor.heightAtLine(nextMarker - 1, 'local') -
        store.editor.heightAtLine(lastMarker - 1, 'local'));
  }
  // returns two neighboring markers' lines, and current scroll percentage between two markers
  const r = { lastMarker: lastMarker, nextMarker: nextMarker, percentage };
  return r;
};

const setPreviewScroll = (editorScroll: IScroll) => {
  let lastPosition = 0;
  let nextPosition =
    document.querySelector<HTMLElement>('#preview').offsetHeight -
    document.getElementById('right-panel').offsetHeight; // maximum scroll

  if (editorScroll.lastMarker) {
    // no marker at very start
    const lastMarkerElement = document.querySelector<HTMLElement>(
      `#preview > [data-source-line="${editorScroll.lastMarker}"]`,
    );
    if (lastMarkerElement) {
      lastPosition = lastMarkerElement.offsetTop;
    }
  }

  if (editorScroll.nextMarker) {
    // no marker at very end
    const nextMarkerElement = document.querySelector<HTMLElement>(
      `#preview > [data-source-line="${editorScroll.nextMarker}"]`,
    );
    if (nextMarkerElement) {
      nextPosition = nextMarkerElement.offsetTop;
    }
  }
  const scrollTop =
    lastPosition + (nextPosition - lastPosition) * editorScroll.percentage; // right scroll according to left percentage
  scrollRight(scrollTop);
};

const getPreviewScroll = (): IScroll => {
  const scroll = document.querySelector('#right-panel').scrollTop;
  let lastLine = 0;
  let lastScroll = 0;
  let nextLine = store.editor.getValue().split('\n').length; // number of lines of markdown
  let nextScroll =
    document.getElementById('preview').offsetHeight -
    document.getElementById('right-panel').offsetHeight; // maximum scroll
  const lineMarkers = document.querySelectorAll<HTMLElement>(
    '#preview > [data-source-line]',
  );
  for (let i = 0; i < lineMarkers.length; i++) {
    const lineMarker = lineMarkers[i];
    if (lineMarker.offsetTop < scroll) {
      lastLine = parseInt(lineMarker.dataset.sourceLine, 10);
      lastScroll = lineMarker.offsetTop;
    } else {
      nextLine = parseInt(lineMarker.dataset.sourceLine, 10);
      nextScroll = lineMarker.offsetTop;
      break;
    }
  }
  let percentage = 0;
  if (lastScroll !== nextScroll) {
    percentage = (scroll - lastScroll) / (nextScroll - lastScroll);
  }
  // returns two neighboring marker lines, and current scroll percentage between two markers
  const r = {
    lastMarker: lastLine,
    nextMarker: nextLine,
    percentage: percentage,
  };
  return r;
};

const setEditorScroll = (previewScroll: IScroll) => {
  const last = store.editor.heightAtLine(previewScroll.lastMarker - 1, 'local');
  const next = store.editor.heightAtLine(previewScroll.nextMarker - 1, 'local');
  scrollLeft((next - last) * previewScroll.percentage + last);
};

export const syncPreview = debounce(() => {
  // sync right with left
  if (scrollingSide !== 'left') {
    setPreviewScroll(getEditorScroll());
  }
}, 256);

export const syncEditor = debounce(() => {
  // sync left with right
  if (scrollingSide !== 'right') {
    setEditorScroll(getPreviewScroll());
  }
}, 256);
