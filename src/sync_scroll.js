import $ from 'jquery'
import { debounce } from 'lodash'

import editor from './editor'
import layout from './layout'

let scrollingSide = null
let timeoutHandle = null
const scrollSide = (side, howToScroll) => {
  if (scrollingSide != null && scrollingSide !== side) {
    return // the other side hasn't finished scrolling
  }
  scrollingSide = side
  clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(() => { scrollingSide = null }, 512)
  howToScroll()
}

const scrollEditor = (scrollTop, when) => {
  setTimeout(() => {
    // editor.session.setScrollTop(scrollTop)
    editor.scrollTo(null, scrollTop)
  }, when)
}
const scrollLeft = (scrollTop) => {
  scrollSide('left', () => {
    // const current = editor.session.getScrollTop()
    const current = editor.getScrollInfo().top
    const step = (scrollTop - current) / 8
    for (let i = 1; i < 8; i++) { // to create some animation
      scrollEditor(current + step * i, 128 / 8 * i)
    }
    scrollEditor(scrollTop, 128)
  })
}

const scrollRight = (scrollTop) => {
  scrollSide('right', () => {
    $('.ui-layout-east').animate({ scrollTop: scrollTop }, 128)
  })
}

const getEditorScroll = () => {
  const lineMarkers = $('article#preview > [data-source-line]')
  const lines = []
  lineMarkers.each((index, element) => {
    lines.push($(element).data('source-line'))
  })
  const currentPosition = editor.getScrollInfo().top
  let lastMarker
  let nextMarker
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const height = editor.heightAtLine(line - 1, 'local')
    if (height < currentPosition) {
      lastMarker = line
    } else {
      nextMarker = line
      break
    }
  }
  let percentage = 0
  if (lastMarker && nextMarker && lastMarker !== nextMarker) {
    percentage = (currentPosition - editor.heightAtLine(lastMarker - 1, 'local')) / (editor.heightAtLine(nextMarker - 1, 'local') - editor.heightAtLine(lastMarker - 1, 'local'))
  }
  // returns two neighboring markers' lines, and current scroll percentage between two markers
  return { lastMarker: lastMarker, nextMarker: nextMarker, percentage }
}

// const getEditorScroll = () => {
//   const lineMarkers = $('article#preview > [data-source-line]')
//   const lines = [] // logical line
//   lineMarkers.each((index, element) => {
//     lines.push($(element).data('source-line'))
//   })
//   const pLines = [] // physical line
//   let pLine = 0
//   for (let i = 0; i < lines[lines.length - 1]; i++) {
//     if ($.inArray(i + 1, lines) !== -1) {
//       pLines.push(pLine)
//     }
//     pLine += editor.session.getRowLength(i) // line height might not be 1 because of wrap
//   }
//   const currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight // current physical line
//   let lastMarker = false
//   let nextMarker = false
//   for (let i = 0; i < pLines.length; i++) {
//     if (pLines[i] < currentLine) {
//       lastMarker = i
//     } else {
//       nextMarker = i
//       break
//     }
//   } // between last marker and next marker
//   let lastLine = 0
//   let nextLine = editor.session.getScreenLength() - 1 // on the top of last physical line, so -1
//   if (lastMarker !== false) {
//     lastLine = pLines[lastMarker]
//   }
//   if (nextMarker !== false) {
//     nextLine = pLines[nextMarker]
//   } // physical lines of two neighboring markers
//   let percentage = 0
//   if (nextLine !== lastLine) { // at the beginning of file, equal, but cannot divide by 0
//     percentage = (currentLine - lastLine) / (nextLine - lastLine)
//   } // scroll percentage between two markers
//   // returns two neighboring markers' logical lines, and current scroll percentage between two markers
//   return { lastMarker: lines[lastMarker], nextMarker: lines[nextMarker], percentage: percentage }
// }

const setPreviewScroll = (editorScroll) => {
  let lastPosition = 0
  let nextPosition = $('article#preview').outerHeight() - $('.ui-layout-east').height() // maximum scroll
  if (editorScroll.lastMarker) { // no marker at very start
    lastPosition = $('article#preview').find('>[data-source-line="' + editorScroll.lastMarker + '"]').get(0).offsetTop
  }
  if (editorScroll.nextMarker) { // no marker at very end
    nextPosition = $('article#preview').find('>[data-source-line="' + editorScroll.nextMarker + '"]').get(0).offsetTop
  }
  const scrollTop = lastPosition + (nextPosition - lastPosition) * editorScroll.percentage // right scroll according to left percentage
  scrollRight(scrollTop)
}

const getPreviewScroll = () => {
  const scroll = $('.ui-layout-east').scrollTop()
  let lastMarker
  let nextMarker
  const lineMarkers = $('article#preview > [data-source-line]')
  for (let i = 0; i < lineMarkers.length; i++) {
    const lineMarker = lineMarkers[i]
    if (lineMarker.offsetTop < scroll) {
      lastMarker = lineMarker
    } else {
      nextMarker = lineMarker
      break
    }
  }
  let percentage = 0
  if (lastMarker && nextMarker && lastMarker !== nextMarker) {
    percentage = (scroll - lastMarker.offsetTop) / (nextMarker.offsetTop - lastMarker.offsetTop)
  }

  // let lastLine = 0
  // let nextLine = $('article#preview').outerHeight() - $('.ui-layout-east').height() // maximum scroll
  // if (lastMarker) {
  //   lastLine = lineMarkers[lastMarker].offsetTop
  // }
  // if (nextMarker) {
  //   nextLine = lineMarkers[nextMarker].offsetTop
  // }
  // let percentage = 0
  // if (nextLine !== lastLine) {
  //   percentage = (scroll - lastLine) / (nextLine - lastLine)
  // }

  // returns two neighboring markers $(element), and current scroll percentage between two markers
  return { lastMarker: lastMarker, nextMarker: nextMarker, percentage: percentage }
}

const setEditorScroll = (previewScroll) => {
  console.log(previewScroll)
  let last = 0
  let next = editor.heightAtLine(editor.getValue().split('\n').length - 1, 'local')
  if (previewScroll.lastMarker) {
    last = editor.heightAtLine(parseInt(previewScroll.lastMarker.getAttribute('data-source-line')) - 1, 'local')
  }
  if (previewScroll.nextMarker) {
    next = editor.heightAtLine(parseInt(previewScroll.nextMarker.getAttribute('data-source-line')) - 1, 'local')
  }
  scrollLeft((next - last) * previewScroll.percentage + last)
}

// const setEditorScroll = (previewScroll) => {
//   const lineMarkers = $('article#preview > [data-source-line]')
//   const lines = [] // logical line
//   lineMarkers.each((index, element) => {
//     lines.push($(element).data('source-line'))
//   })
//   const pLines = [] // physical line
//   let pLine = 0
//   for (let i = 0; i < lines[lines.length - 1]; i++) {
//     if ($.inArray(i + 1, lines) !== -1) {
//       pLines.push(pLine)
//     }
//     pLine += editor.session.getRowLength(i) // line height might not be 1 because of wrap
//   }
//   let lastLine = 0
//   let nextLine = editor.session.getScreenLength() - 1 // on the top of last physical line, so -1
//   if (previewScroll.lastMarker) {
//     lastLine = pLines[previewScroll.lastMarker]
//   }
//   if (previewScroll.nextMarker) {
//     nextLine = pLines[previewScroll.nextMarker]
//   }
//   const scrollTop = ((nextLine - lastLine) * previewScroll.percentage + lastLine) * editor.renderer.lineHeight
//   scrollLeft(scrollTop)
// }

const syncPreview = debounce(() => { // sync right with left
  if (layout.panes.east.outerWidth() < 8) {
    return // no need to sync if panel closed
  }
  if (scrollingSide !== 'left') {
    setPreviewScroll(getEditorScroll())
  }
}, 256, false)

const syncEditor = debounce(() => { // sync left with right
  if (layout.panes.east.outerWidth() < 8) {
    return // no need to sync if panel closed
  }
  if (scrollingSide !== 'right') {
    setEditorScroll(getPreviewScroll())
  }
}, 256, false)

export { syncPreview, syncEditor }
