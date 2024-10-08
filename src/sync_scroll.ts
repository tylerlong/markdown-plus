import $ from 'jquery';
import debounce from 'lodash/debounce';
import store from './store';

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

const scrollEditor = (scrollTop: number, when: number): void => {
  setTimeout(() => {
    store.editor.scrollTo(null, scrollTop);
  }, when);
};
const scrollLeft = (scrollTop: number): void => {
  scrollSide('left', () => {
    const current = store.editor.getScrollInfo().top;
    const step = (scrollTop - current) / 8;
    for (let i = 1; i < 8; i++) {
      // to create some animation
      scrollEditor(current + step * i, (128 / 8) * i);
    }
    scrollEditor(scrollTop, 128);
  });
};

const scrollRight = (scrollTop: number): void => {
  scrollSide('right', () => {
    $('.ui-layout-east').animate({ scrollTop: scrollTop }, 128);
  });
};

const getEditorScroll = (): IScroll => {
  const lineMarkers = $('article#preview > [data-source-line]');
  const lines = [];
  lineMarkers.each((index, element) => {
    lines.push($(element).data('source-line'));
  });
  const currentPosition = store.editor.getScrollInfo().top;
  let lastMarker;
  let nextMarker;
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
    $('article#preview').outerHeight() - $('.ui-layout-east').height(); // maximum scroll
  if (editorScroll.lastMarker) {
    // no marker at very start
    lastPosition = $('article#preview')
      .find('>[data-source-line="' + editorScroll.lastMarker + '"]')
      .get(0).offsetTop;
  }
  if (editorScroll.nextMarker) {
    // no marker at very end
    nextPosition = $('article#preview')
      .find('>[data-source-line="' + editorScroll.nextMarker + '"]')
      .get(0).offsetTop;
  }
  const scrollTop =
    lastPosition + (nextPosition - lastPosition) * editorScroll.percentage; // right scroll according to left percentage
  scrollRight(scrollTop);
};

const getPreviewScroll = (): IScroll => {
  const scroll = document.querySelector('.ui-layout-east').scrollTop;
  let lastLine = 0;
  let lastScroll = 0;
  let nextLine = store.editor.getValue().split('\n').length; // number of lines of markdown
  let nextScroll =
    $('article#preview').outerHeight() - $('.ui-layout-east').height(); // maximum scroll
  const lineMarkers = $('article#preview > [data-source-line]');
  for (let i = 0; i < lineMarkers.length; i++) {
    const lineMarker = lineMarkers[i];
    if (lineMarker.offsetTop < scroll) {
      lastLine = parseInt(lineMarker.getAttribute('data-source-line'), 10);
      lastScroll = lineMarker.offsetTop;
    } else {
      nextLine = parseInt(lineMarker.getAttribute('data-source-line'), 10);
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

export const syncPreview = debounce(
  () => {
    // sync right with left
    if (store.layout.panes.east.outerWidth() < 8) {
      return; // no need to sync if panel closed
    }
    if (scrollingSide !== 'left') {
      setPreviewScroll(getEditorScroll());
    }
  },
  256,
  { leading: false, trailing: true },
);

export const syncEditor = debounce(
  () => {
    // sync left with right
    if (store.layout.panes.east.outerWidth() < 8) {
      return; // no need to sync if panel closed
    }
    if (scrollingSide !== 'right') {
      setEditorScroll(getPreviewScroll());
    }
  },
  256,
  { leading: false, trailing: true },
);
