var scrollingSide = null;
var timeoutHandle = null;
function scrollSide(side, howToScroll) {
  if(scrollingSide != null && scrollingSide != side) {
    return; // the other side hasn't finished scrolling
  }
  scrollingSide = side
  clearTimeout(timeoutHandle);
  timeoutHandle = setTimeout(function(){ scrollingSide = null; }, 512);
  howToScroll();
}

function scrollEditor(scrollTop, when) {
  setTimeout(function() {
    editor.session.setScrollTop(scrollTop);
  }, when);
}
function scrollLeft(scrollTop) {
  scrollSide('left', function() {
    var current = editor.session.getScrollTop();
    var step = (scrollTop - current) / 8;
    for(var i = 1; i < 8; i++) { // to create some animation
      scrollEditor(current + step * i, 128 / 8 * i);
    }
    scrollEditor(scrollTop, 128);
  });
}

function scrollRight(scrollTop) {
  scrollSide('right', function() {
    $('.ui-layout-east').animate({ scrollTop: scrollTop }, 128);
  });
}



function get_editor_scroll() {
  var line_markers = $('article#preview > [data-source-line]');
  var lines = []; // logical line
  line_markers.each(function() {
    lines.push($(this).data('source-line'));
  });
  var pLines = []; // physical line
  var pLine = 0;
  for(var i = 0; i < lines[lines.length - 1]; i++) {
    if($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine);
    }
    pLine += editor.session.getRowLength(i); // line height might not be 1 because of wrap
  }
  var currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight; // current physical line
  var lastMarker = false;
  var nextMarker = false;
  for(var i = 0; i < pLines.length; i++) {
    if(pLines[i] < currentLine) {
      lastMarker = i;
    } else {
      nextMarker = i;
      break;
    }
  } // between last marker and next marker
  var lastLine = 0;
  var nextLine = editor.session.getScreenLength() - 1; // on the top of last physical line, so -1
  if(lastMarker !== false) {
    lastLine = pLines[lastMarker];
  }
  if(nextMarker !== false) {
    nextLine = pLines[nextMarker];
  } // physical lines of two neighboring markers
  var percentage = 0;
  if(nextLine !== lastLine) { // at the beginning of file, equal, but cannot divide by 0
    percentage = (currentLine - lastLine) / (nextLine - lastLine);
  } // scroll percentage between two markers
  // returns two neighboring markers' logical lines, and current scroll percentage between two markers
  return { lastMarker: lines[lastMarker], nextMarker: lines[nextMarker], percentage: percentage };
}

function set_preview_scroll(editor_scroll) {
  var lastPosition = 0;
  var nextPosition = $('article#preview').outerHeight() - $('.ui-layout-east').height(); // maximum scroll
  if(editor_scroll.lastMarker !== undefined) { // no marker at very start
    lastPosition = $('article#preview').find('>[data-source-line="' + editor_scroll.lastMarker + '"]').get(0).offsetTop;
  }
  if(editor_scroll.nextMarker !== undefined) { // no marker at very end
    nextPosition = $('article#preview').find('>[data-source-line="' + editor_scroll.nextMarker + '"]').get(0).offsetTop;
  }
  var scrollTop = lastPosition + (nextPosition - lastPosition) * editor_scroll.percentage; // right scroll according to left percentage
  scrollRight(scrollTop);
}

function get_preview_scroll() {
  var scroll = $('.ui-layout-east').scrollTop();
  var lastMarker = false;
  var nextMarker = false;
  var line_markers = $('article#preview > [data-source-line]');
  for(var i = 0; i < line_markers.length; i++) {
    if(line_markers[i].offsetTop < scroll) {
      lastMarker = i;
    } else {
      nextMarker = i;
      break;
    }
  }
  var lastLine = 0;
  var nextLine = $('article#preview').outerHeight() - $('.ui-layout-east').height(); // maximum scroll
  if(lastMarker !== false) {
    lastLine = line_markers[lastMarker].offsetTop;
  }
  if(nextMarker !== false) {
    nextLine = line_markers[nextMarker].offsetTop;
  }
  var percentage = 0;
  if(nextLine !== lastLine) {
    percentage = (scroll - lastLine) / (nextLine - lastLine);
  }
  // returns two neighboring markers' No., and current scroll percentage between two markers
  return { lastMarker: lastMarker, nextMarker: nextMarker, percentage: percentage };
}

function set_editor_scroll(preview_scroll) {
  var line_markers = $('article#preview > [data-source-line]');
  var lines = []; // logical line
  line_markers.each(function() {
    lines.push($(this).data('source-line'));
  });
  var pLines = []; // physical line
  var pLine = 0;
  for(var i = 0; i < lines[lines.length - 1]; i++) {
    if($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine);
    }
    pLine += editor.session.getRowLength(i) // line height might not be 1 because of wrap
  }
  var lastLine = 0;
  var nextLine = editor.session.getScreenLength() - 1; // on the top of last physical line, so -1
  if(preview_scroll.lastMarker !== false) {
    lastLine = pLines[preview_scroll.lastMarker]
  }
  if(preview_scroll.nextMarker !== false) {
    nextLine = pLines[preview_scroll.nextMarker]
  }
  var scrollTop = ((nextLine - lastLine) * preview_scroll.percentage + lastLine) * editor.renderer.lineHeight;
  scrollLeft(scrollTop);
}



var sync_preview = _.debounce(function() { // sync right with left
  if(layout.panes.east.outerWidth() < 8) {
    return; // no need to sync if panel closed
  }
  if(scrollingSide != 'left') {
    set_preview_scroll(get_editor_scroll());
  }
}, 256, false);

var sync_editor = _.debounce(function() { // sync left with right
  if(layout.panes.east.outerWidth() < 8) {
    return; // no need to sync if panel closed
  }
  if(scrollingSide != 'right') {
    set_editor_scroll(get_preview_scroll());
  }
}, 256, false);
