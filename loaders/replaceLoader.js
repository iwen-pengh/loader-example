const loaderUtils = require('loader-utils');

module.exports = function (source) {
  //拿到options 配置
  const options = loaderUtils.getOptions(this);
  //回头options里面配置个value参数
  const { value } = options; 
  //将源文件内容替换成value
  const result = source.replace("{{ __content__ }}", JSON.stringify(value));
  //this.callback 也是官方提供的API，替代return
  this.callback(null, result);
}