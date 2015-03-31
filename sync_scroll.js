// 思路： 找出所有的header line，计算出每一个的高度（从第一行开始算的高度）
// 获取当前的scrollTop， 然后知道当前时在哪两个header之间，滚动的比例是多少
// 右侧获取响应的header，滚动到响应的比例
// editor.session.getRowLength(3) 获取指定行的行数。（考虑wrap因素）
// editor.renderer.lineHeight 每一行所占高度。
// editor.session.getScrollTop() 当前滚动到的位置。
// editor.session.getScreenLength() 总的物理行数 考虑wrap因素


function get_editor_scroll() {
  var headers = $('.ui-layout-east article').find('h1,h2,h3,h4,h5,h6').filter('[data-line]');
  var lines = []; // 逻辑行
  headers.each(function(){
    lines.push($(this).data('line'));
  });
  console.log(lines);

  var pLines = []; // 物理行
  var pLine = 0;
  for(var i = 0; i < lines[lines.length - 1]; i++) {
    if($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine);
    }
    pLine += editor.session.getRowLength(i)
  }
  console.log(pLines);

  var currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight; // 物理行
  console.log(currentLine);

  var lastHeader = false;
  var nextHeader = false;
  for(var i = 0; i < pLines.length; i++) {
    if(pLines[i] < currentLine) {
      lastHeader = i;
    } else {
      nextHeader = i;
      break;
    }
  }
  var lastLine = 0;
  var nextLine = editor.session.getScreenLength() - 1;
  if(lastHeader !== false) {
    lastLine = pLines[lastHeader];
  }
  if(nextHeader !== false) {
    nextLine = pLines[nextHeader];
  }
  console.log('lastLine: ' + lastLine);
  console.log('currentLine: ' + currentLine);
  console.log('nextLine: ' + nextLine);
  var percentage = 0;
  if(nextLine !== lastLine) { // 行首标题的情况下可能相等
    percentage = (currentLine - lastLine) / (nextLine - lastLine);
  }

  var result = { lastHeader: lines[lastHeader], nextHeader: lines[nextHeader], percentage: percentage };
  return result;
}

function set_preview_scroll(editor_scroll) {
  console.log(editor_scroll);
  var lastPosition = 0;
  var nextPosition = $('.ui-layout-east article').outerHeight() - $('.ui-layout-east').height();
  if(editor_scroll.lastHeader !== undefined) {
    lastPosition = $('.ui-layout-east article').find('h1,h2,h3,h4,h5,h6').filter('[data-line="' + editor_scroll.lastHeader + '"]').get(0).offsetTop;
  }
  if(editor_scroll.nextHeader !== undefined) {
    nextPosition = $('.ui-layout-east article').find('h1,h2,h3,h4,h5,h6').filter('[data-line="' + editor_scroll.nextHeader + '"]').get(0).offsetTop;
  }
  console.log(lastPosition);
  console.log(nextPosition);
  scrollPosition = lastPosition + (nextPosition - lastPosition) * editor_scroll.percentage;
  $('.ui-layout-east').animate({scrollTop: scrollPosition}, 128);
}
