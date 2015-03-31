function get_editor_scroll() {
  var headers = $('.ui-layout-east article').find('h1,h2,h3,h4,h5,h6').filter('[data-line]'); // 把没有data-line属性的排除掉
  var lines = []; // 逻辑行
  headers.each(function(){
    lines.push($(this).data('line'));
  });
  var pLines = []; // 物理行
  var pLine = 0;
  for(var i = 0; i < lines[lines.length - 1]; i++) {
    if($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine);
    }
    pLine += editor.session.getRowLength(i) // 因为有wrap，所以行高未必是1
  }
  var currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight; // 当前滚动到的物理行
  var lastHeader = false;
  var nextHeader = false;
  for(var i = 0; i < pLines.length; i++) {
    if(pLines[i] < currentLine) {
      lastHeader = i;
    } else {
      nextHeader = i;
      break;
    }
  } // 当前滚动到了哪两个header中间
  var lastLine = 0;
  var nextLine = editor.session.getScreenLength() - 1; // 最后一个物理行的顶部，所以 -1
  if(lastHeader !== false) {
    lastLine = pLines[lastHeader];
  }
  if(nextHeader !== false) {
    nextLine = pLines[nextHeader];
  } // 前后两个header的物理行
  var percentage = 0;
  if(nextLine !== lastLine) { // 行首就是标题的情况下可能相等，0 不能作为除数
    percentage = (currentLine - lastLine) / (nextLine - lastLine);
  } // 当前位置在两个header之间所处的百分比
  return { lastHeader: lines[lastHeader], nextHeader: lines[nextHeader], percentage: percentage }; // 返回的是前后两个header对应的逻辑行，以及当前位置在前后两个header之间所处的百分比
}

function set_preview_scroll(editor_scroll) {
  var lastPosition = 0;
  var nextPosition = $('.ui-layout-east article').outerHeight() - $('.ui-layout-east').height(); // 这是总共可以scroll的最大幅度
  if(editor_scroll.lastHeader !== undefined) { // 最开始的位置没有标题
    lastPosition = $('.ui-layout-east article').find('h1,h2,h3,h4,h5,h6').filter('[data-line="' + editor_scroll.lastHeader + '"]').get(0).offsetTop;
  }
  if(editor_scroll.nextHeader !== undefined) { // 最末尾的位置没有标题
    nextPosition = $('.ui-layout-east article').find('h1,h2,h3,h4,h5,h6').filter('[data-line="' + editor_scroll.nextHeader + '"]').get(0).offsetTop;
  } // 查找出前后两个header在页面上所处的滚动距离
  scrollPosition = lastPosition + (nextPosition - lastPosition) * editor_scroll.percentage; // 按照左侧的百分比计算出右侧应该滚动到的位置
  $('.ui-layout-east').animate({scrollTop: scrollPosition}, 128); // 加一点动画效果
}
