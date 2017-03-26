import $ from 'jquery'
import _ from 'underscore'

const editor = window.editor
const layout = window.layout

let scrollingSide = null
let timeoutHandle = null
function scrollSide (side, howToScroll) {
  if (scrollingSide != null && scrollingSide !== side) {
    return // the other side hasn't finished scrolling
  }
  scrollingSide = side
  clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(function () { scrollingSide = null }, 512)
  howToScroll()
}

function scrollEditor (scrollTop, when) {
  setTimeout(function () {
    editor.session.setScrollTop(scrollTop)
  }, when)
}
function scrollLeft (scrollTop) {
  scrollSide('left', function () {
    const current = editor.session.getScrollTop()
    const step = (scrollTop - current) / 8
    for (let i = 1; i < 8; i++) { // to create some animation
      scrollEditor(current + step * i, 128 / 8 * i)
    }
    scrollEditor(scrollTop, 128)
  })
}

function scrollRight (scrollTop) {
  scrollSide('right', function () {
    $('.ui-layout-east').animate({ scrollTop: scrollTop }, 128)
  })
}

function getEditorScroll () {
  const lineMarkers = $('article#preview > [data-source-line]')
  const lines = [] // logical line
  lineMarkers.each(function () {
    lines.push($(this).data('source-line'))
  })
  const pLines = [] // physical line
  let pLine = 0
  for (let i = 0; i < lines[lines.length - 1]; i++) {
    if ($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine)
    }
    pLine += editor.session.getRowLength(i) // line height might not be 1 because of wrap
  }
  const currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight // current physical line
  let lastMarker = false
  let nextMarker = false
  for (let i = 0; i < pLines.length; i++) {
    if (pLines[i] < currentLine) {
      lastMarker = i
    } else {
      nextMarker = i
      break
    }
  } // between last marker and next marker
  let lastLine = 0
  let nextLine = editor.session.getScreenLength() - 1 // on the top of last physical line, so -1
  if (lastMarker !== false) {
    lastLine = pLines[lastMarker]
  }
  if (nextMarker !== false) {
    nextLine = pLines[nextMarker]
  } // physical lines of two neighboring markers
  let percentage = 0
  if (nextLine !== lastLine) { // at the beginning of file, equal, but cannot divide by 0
    percentage = (currentLine - lastLine) / (nextLine - lastLine)
  } // scroll percentage between two markers
  // returns two neighboring markers' logical lines, and current scroll percentage between two markers
  return { lastMarker: lines[lastMarker], nextMarker: lines[nextMarker], percentage: percentage }
}

function setPreviewScroll (editorScroll) {
  let lastPosition = 0
  let nextPosition = $('article#preview').outerHeight() - $('.ui-layout-east').height() // maximum scroll
  if (editorScroll.lastMarker !== undefined) { // no marker at very start
    lastPosition = $('article#preview').find('>[data-source-line="' + editorScroll.lastMarker + '"]').get(0).offsetTop
  }
  if (editorScroll.nextMarker !== undefined) { // no marker at very end
    nextPosition = $('article#preview').find('>[data-source-line="' + editorScroll.nextMarker + '"]').get(0).offsetTop
  }
  const scrollTop = lastPosition + (nextPosition - lastPosition) * editorScroll.percentage // right scroll according to left percentage
  scrollRight(scrollTop)
}

function getPreviewScroll () {
  const scroll = $('.ui-layout-east').scrollTop()
  let lastMarker = false
  let nextMarker = false
  const lineMarkers = $('article#preview > [data-source-line]')
  for (let i = 0; i < lineMarkers.length; i++) {
    if (lineMarkers[i].offsetTop < scroll) {
      lastMarker = i
    } else {
      nextMarker = i
      break
    }
  }
  let lastLine = 0
  let nextLine = $('article#preview').outerHeight() - $('.ui-layout-east').height() // maximum scroll
  if (lastMarker !== false) {
    lastLine = lineMarkers[lastMarker].offsetTop
  }
  if (nextMarker !== false) {
    nextLine = lineMarkers[nextMarker].offsetTop
  }
  let percentage = 0
  if (nextLine !== lastLine) {
    percentage = (scroll - lastLine) / (nextLine - lastLine)
  }
  // returns two neighboring markers' No., and current scroll percentage between two markers
  return { lastMarker: lastMarker, nextMarker: nextMarker, percentage: percentage }
}

function setEditorScroll (previewScroll) {
  const lineMarkers = $('article#preview > [data-source-line]')
  const lines = [] // logical line
  lineMarkers.each(function () {
    lines.push($(this).data('source-line'))
  })
  const pLines = [] // physical line
  let pLine = 0
  for (let i = 0; i < lines[lines.length - 1]; i++) {
    if ($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine)
    }
    pLine += editor.session.getRowLength(i) // line height might not be 1 because of wrap
  }
  let lastLine = 0
  let nextLine = editor.session.getScreenLength() - 1 // on the top of last physical line, so -1
  if (previewScroll.lastMarker !== false) {
    lastLine = pLines[previewScroll.lastMarker]
  }
  if (previewScroll.nextMarker !== false) {
    nextLine = pLines[previewScroll.nextMarker]
  }
  const scrollTop = ((nextLine - lastLine) * previewScroll.percentage + lastLine) * editor.renderer.lineHeight
  scrollLeft(scrollTop)
}

const syncPreview = _.debounce(function () { // sync right with left
  if (layout.panes.east.outerWidth() < 8) {
    return // no need to sync if panel closed
  }
  if (scrollingSide !== 'left') {
    setPreviewScroll(getEditorScroll())
  }
}, 256, false)

const syncEditor = _.debounce(function () { // sync left with right
  if (layout.panes.east.outerWidth() < 8) {
    return // no need to sync if panel closed
  }
  if (scrollingSide !== 'right') {
    setEditorScroll(getPreviewScroll())
  }
}, 256, false)

export default { syncPreview, syncEditor }
