String.prototype.repeat = function(n) { // 将一个字符串重复n次
  return new Array(n + 1).join(this);
}
