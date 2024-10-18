import { EditorView } from '@codemirror/view';
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

const scrollEditor = (targetLineNumber: number): void => {
  scrollSide('left', () => {
    animate(
      (lineNumber) =>
        store.editor.dispatch({
          effects: EditorView.scrollIntoView(
            store.editor.state.doc.line(lineNumber).from,
            { y: 'start' },
          ),
        }),
      store.editor.state.doc.lineAt(
        store.editor.lineBlockAtHeight(store.editor.scrollDOM.scrollTop).from,
      ).number,
      targetLineNumber,
      128,
    );
  });
};

const scrollPreview = (scrollTop: number): void => {
  scrollSide('right', () => {
    const element = document.getElementById('right-panel');
    animate((i) => (element.scrollTop = i), element.scrollTop, scrollTop, 128);
  });
};

const getEditorScroll = (): IScroll => {
  const lineMarkers = document.querySelectorAll('#preview > [data-sl]');
  const lines: number[] = [];
  lineMarkers.forEach((element: HTMLElement) => {
    lines.push(parseInt(element.dataset.sl, 10));
  });
  const currentLine = store.editor.state.doc.lineAt(
    store.editor.lineBlockAtHeight(store.editor.scrollDOM.scrollTop).from,
  ).number;
  let lastMarker: number;
  let nextMarker: number;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] < currentLine) {
      lastMarker = lines[i];
    } else {
      nextMarker = lines[i];
      break;
    }
  }
  let percentage = 0;
  if (lastMarker && nextMarker && lastMarker !== nextMarker) {
    percentage = (currentLine - lastMarker) / (nextMarker - lastMarker);
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
    const lastMarkerElement = document.querySelector<HTMLElement>(
      `#preview > [data-sl="${editorScroll.lastMarker}"]`,
    );
    if (lastMarkerElement) {
      lastPosition = lastMarkerElement.offsetTop;
    }
  }

  if (editorScroll.nextMarker) {
    const nextMarkerElement = document.querySelector<HTMLElement>(
      `#preview > [data-sl="${editorScroll.nextMarker}"]`,
    );
    if (nextMarkerElement) {
      nextPosition = nextMarkerElement.offsetTop;
    }
  }
  const scrollTop =
    lastPosition + (nextPosition - lastPosition) * editorScroll.percentage; // right scroll according to left percentage
  scrollPreview(scrollTop);
};

const getPreviewScroll = (): IScroll => {
  const scroll = document.querySelector('#right-panel').scrollTop;
  let lastLine = 1; // editor line starts with 1
  let lastScroll = 0;
  let nextLine = store.editor.state.doc.toString().split('\n').length; // number of lines of markdown
  let nextScroll =
    document.getElementById('preview').offsetHeight -
    document.getElementById('right-panel').offsetHeight; // maximum scroll
  const lineMarkers = document.querySelectorAll<HTMLElement>(
    '#preview > [data-sl]',
  );
  for (let i = 0; i < lineMarkers.length; i++) {
    const lineMarker = lineMarkers[i];
    if (lineMarker.offsetTop < scroll) {
      lastLine = parseInt(lineMarker.dataset.sl, 10);
      lastScroll = lineMarker.offsetTop;
    } else {
      nextLine = parseInt(lineMarker.dataset.sl, 10);
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
  const targetLineNumber =
    (previewScroll.nextMarker - previewScroll.lastMarker) *
      previewScroll.percentage +
    previewScroll.lastMarker;
  scrollEditor(targetLineNumber);
};

export const syncPreview = debounce(() => {
  // sync right with left
  if (scrollingSide !== 'left') {
    const editorScroll = getEditorScroll();
    setPreviewScroll(editorScroll);
  }
}, 256);

export const syncEditor = debounce(() => {
  // sync left with right
  if (scrollingSide !== 'right') {
    const previewScroll = getPreviewScroll();
    setEditorScroll(previewScroll);
  }
}, 256);
