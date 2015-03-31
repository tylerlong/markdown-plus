// 思路： 找出所有的header line，计算出每一个的高度（从第一行开始算的高度）
// 获取当前的scrollTop， 然后知道当前时在哪两个header之间，滚动的比例是多少
// 右侧获取响应的header，滚动到响应的比例
// editor.session.getRowLength(3) 获取指定行的行数。（考虑wrap因素）
// editor.renderer.lineHeight 每一行所占高度。
// editor.session.getScrollTop() 当前滚动到的位置。
// editor.session.getScreenLength() 总的物理行数 考虑wrap因素


//todo: 下划线创建的header没有考虑


function get_editor_scroll() {
  var lines = editor.getValue().split('\n');
  var physicalLine = 0;
  var headerLines = [];
  for(var i = 0; i < lines.length; i++) {
    if(/^#{1,6}\s+/.test(lines[i])) {
      headerLines.push(physicalLine);
    }
    physicalLine += editor.session.getRowLength(i);
  }

  var currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight;

  var lastHeader = false;
  var nextHeader = false;
  for(var i = 0; i < headerLines.length; i++) {
    if(headerLines[i] > currentLine) {
      nextHeader = i;
      break;
    } else {
      lastHeader = i;
    }
  }

  var lastLine = 0;
  var nextLine = physicalLine;
  if(lastHeader !== false) {
    lastLine = headerLines[lastHeader];
  }
  if(nextHeader !== false) {
    nextLine = headerLines[nextHeader];
  }

  var percentage = (currentLine - lastLine) / (nextLine - lastLine);
  console.log(percentage + ' between the ' + lastHeader + 'th and the ' + nextHeader + 'th headers');

  var result = { lastHeader: lastHeader, nextHeader: nextHeader, percentage: percentage };
  return result;
}

function set_preview_scroll(editor_scroll) {
  var lastPosition = 0;
  var nextPosition = $('.ui-layout-east article').outerHeight() - $('.ui-layout-east').height();
  var headers = $('.ui-layout-east article').find('h1,h2,h3,h4,h5,h6');
  if(editor_scroll.lastHeader !== false) {
    lastPosition = headers.eq(editor_scroll.lastHeader).get(0).offsetTop;
  }
  if(editor_scroll.nextHeader !== false) {
    nextPosition = headers.eq(editor_scroll.nextHeader).get(0).offsetTop;
  }
  scrollPosition = lastPosition + (nextPosition - lastPosition) * editor_scroll.percentage;
  console.log(scrollPosition);
  $('.ui-layout-east').animate({scrollTop: scrollPosition}, 256);
}
