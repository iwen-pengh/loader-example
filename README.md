
## 一、webpack为什么需要Loader
`webpack` 只能理解 `JavaScript` 和 `JSON` 语言。`loader` 可以让 `webpack` 能够去处理其他类型的文件语言，并将它们转换为`webpack`所能识别的模块，以供应用程序使用



## 三、初始化项目？

`mkdir loader-example` 后，此目录下 npm init -y生成默认的package.json文件 ,在文件中配置打包命令
```js
"scripts": {
  "build": "webpack serve"
  "build": "webpack"
}
```
根目录创建`webpack.config.js`
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // 先设置为development，不压缩代码，方便调试
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist');
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),  //根目录建一个index.html文件
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
  }
}
```

根目录创建src文件夹，里面创建`index.js`的文件 输入
```js
const content = {{ __content__ }};
console.log(content);
document.getElementsByTagName('body')[0].innerHTML = content
```

安装对应的依赖后，执行`npm run dev` or `run build`提示报错了
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42a6b377b3d945c7bb84922bd6ee73a1~tplv-k3u1fbpfcp-watermark.image)

此时`{{ __content__ }}` 模块分析失败，提示需要有个`loader` 处理这个文件

## 三、搞了半天终于开始要写Loader了？
 
 > Loader是什么

首先我们建议：要阅读一遍`webpack`官网的介绍： [如何编写一个loader?](https://webpack.js.org/contribute/writing-a-loader/)

看完后，我们能知道，`Loader`本质上就是一个`node`模块，能导出一个函数，这个函数接收一个参数 (字符串或者`buffer`类型) ，这个参数就是我们需要转译的源文件，经过`loader`的转换编译替换等等...的处理，最终返回给`webpack`

根目录建一个`loaders`文件夹 , 里面建一个`replaceLoader.js`
```js
// 根据这个思路我们先写个loader 模块，接收一个参数，什么都没有做然后在返回
module.exports = function (source) {
	//source 源文件内容，字符串或者 buffer类型
	return source;
}
```

> 接着上面思路
```js
module.exports = function (source) {
	 //将源文件 {{ __content__ }} 替换成 'iwen'
	const result = source.replace("{{ __content__ }}", JSON.stringify('iwen'));
	return result;
}
```
> 好了，loader写完了，是不是非常简单，然后`webpack`里面在配置下

```js
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
      }
    }]
  },
```

> 完善下我们的`loader`

通过对官网的介绍，我们了解到 `loader-utils` 这个工具库提供了一个 `getOptions` 方法能拿到`webpack loader`配置里面的`option`配置
```js
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
```
其他[loader API](https://webpack.js.org/api/loaders/)

`webpack`配置下`options`

```js
 module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
        options: {
          value: 'iwen' //参数传入到loader里面，方便getOptions接收到
        } 
      }
    }]
  },
```

执行 `npm run dev` 
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8d6dba10cbc4b889b11d423e3ab2714~tplv-k3u1fbpfcp-watermark.image)

## 一、结语
感谢各位老铁，点赞加关注


