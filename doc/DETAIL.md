# 功能

## Zepto 扩展

默认引入的 `Zepto` 只包含 [默认的 modules](http://zeptojs.com/#modules)。如果还需要引入其他 `modules`，先在当前项目中安装 `npm i --save zepto.js`，然后在 js 文件中引入

```js
require('zepto.js/src/detect.js')     // 引入 detect
require('zepto.js/src/fx.js')         // 引入 fx
require('zepto.js/src/fx_methods.js') // 引入 fx_methods
```

## 雪碧图

合成的雪碧图的使用了 [postcss-sprites](https://github.com/2createStudio/postcss-sprites) 插件。

提供的默认配置

```js
  spritesOptions: {
    stylesheetPath: 'src/css/',
    spritePath: 'src/img/',
    retina: true,
    relativeTo: 'rule',
    spritesmith: {
      algorithm: 'left-right',
      padding: 2
    },
    verbose: false,
    // 将 img 目录下的子目录作为分组，子目录下的 png 图片会合成雪碧图
    groupBy: function (image) {
      var reg = /img\/(\S+)\/\S+\.png$/.exec(image.url)
      var groupName = reg ? reg[1] : reg
      return groupName ? Promise.resolve(groupName) : Promise.reject()
    },
    // 非 img 子目录下面的 png 不合
    filterBy: function (image) {
      return /img\/\S+\/\S+\.png$/.test(image.url) ? Promise.resolve() : Promise.reject()
    }
  }
```

`spritePath` 为 `'src/img/'`，默认以该目录下的子目录作为分组，子目录下的 png 图片会合成雪碧图，非子目录下面的 png 不会合。
例如：

```sh
.
└── src
    └── img
        ├── a
        │   ├── p1.png
        │   └── p2.png
        ├── b.png
        └── c.png
```

`a` 目录里的 `p1.png` 和 `p2.png` 会合成雪碧图，生成 `sprite.a.png`，`build` 构建后的目录结构

```sh
.
└── src
    └── img
        ├── b.png
        ├── c.png
        └── sprite.a.png
```

## postcss-assets

提供了获取图片宽高的函数，可以直接在样式里使用。

```css
body {
  width: width('images/foobar.png'); /* 320px */
  height: height('images/foobar.png'); /* 240px */
  background-size: size('images/foobar.png'); /* 320px 240px */
}
```

[具体详情](https://github.com/assetsjs/postcss-assets#image-dimensions)

## 图片转 Base64

默认 `src/img` 目录下的图片由参数 `limit` 判断是否转 Base64

```js
  imgLoaderQuery: {
    limit: 1000,      // 文件大小小于 1000 的图片会被转成 Base64
    name: 'img/[name].[ext]?[hash:6]'
  }
```

如果某些图片明确需要转 Base64，可以通过配置来控制

```js
imgToBase64Dir: /src\/img-base64/
```

该目录下的的图片（limit=10000000）默认被转成 base64。

## 构建时查看 webpack 配置

执行 `elf build` 时，支持参数 `-d, --debug <key>`，可以查看 webpack 配置。例如

```sh
elf build -d 'output' # 查看 output 配置项

elf build -d '.' # 查看整个配置
```

## 构建文件分析

设置 `enableWebpackVisualizer` 为 `true`，执行构建命令 `elf build` 后，会在 `output.path` 目录中会生成文件 `webpack-stats.html`，用浏览器直接打开，可以查看分析构建文件的组成。


