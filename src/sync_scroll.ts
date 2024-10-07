import $ from 'jquery';
import debounce from 'lodash/debounce';

import editor from './editor';
import layout from './layout';

let scrollingSide = null;
let timeoutHandle = null;
const scrollSide = (side, howToScroll) => {
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

const scrollEditor = (scrollTop, when) => {
  setTimeout(() => {
    editor.scrollTo(null, scrollTop);
  }, when);
};
const scrollLeft = (scrollTop) => {
  scrollSide('left', () => {
    const current = editor.getScrollInfo().top;
    const step = (scrollTop - current) / 8;
    for (let i = 1; i < 8; i++) {
      // to create some animation
      scrollEditor(current + step * i, (128 / 8) * i);
    }
    scrollEditor(scrollTop, 128);
  });
};

const scrollRight = (scrollTop) => {
  scrollSide('right', () => {
    $('.ui-layout-east').animate({ scrollTop: scrollTop }, 128);
  });
};

const getEditorScroll = () => {
  const lineMarkers = $('article#preview > [data-source-line]');
  const lines = [];
  lineMarkers.each((index, element) => {
    lines.push($(element).data('source-line'));
  });
  const currentPosition = editor.getScrollInfo().top;
  let lastMarker;
  let nextMarker;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const height = editor.heightAtLine(line - 1, 'local');
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
      (currentPosition - editor.heightAtLine(lastMarker - 1, 'local')) /
      (editor.heightAtLine(nextMarker - 1, 'local') -
        editor.heightAtLine(lastMarker - 1, 'local'));
  }
  // returns two neighboring markers' lines, and current scroll percentage between two markers
  return { lastMarker: lastMarker, nextMarker: nextMarker, percentage };
};

const setPreviewScroll = (editorScroll) => {
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

const getPreviewScroll = () => {
  const scroll = $('.ui-layout-east').scrollTop();
  let lastLine = 0;
  let lastScroll = 0;
  let nextLine = editor.getValue().split('\n').length; // number of lines of markdown
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
  return { lastMarker: lastLine, nextMarker: nextLine, percentage: percentage };
};

const setEditorScroll = (previewScroll) => {
  const last = editor.heightAtLine(previewScroll.lastMarker - 1, 'local');
  const next = editor.heightAtLine(previewScroll.nextMarker - 1, 'local');
  scrollLeft((next - last) * previewScroll.percentage + last);
};

const syncPreview = debounce(
  () => {
    // sync right with left
    if (layout.panes.east.outerWidth() < 8) {
      return; // no need to sync if panel closed
    }
    if (scrollingSide !== 'left') {
      setPreviewScroll(getEditorScroll());
    }
  },
  256,
  { leading: false, trailing: true },
);

const syncEditor = debounce(
  () => {
    // sync left with right
    if (layout.panes.east.outerWidth() < 8) {
      return; // no need to sync if panel closed
    }
    if (scrollingSide !== 'right') {
      setEditorScroll(getPreviewScroll());
    }
  },
  256,
  { leading: false, trailing: true },
);

export { syncPreview, syncEditor };
