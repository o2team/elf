# 详细说明

`elf` 的很多功能都是通过 webpack 的插件实现的，这些插件基本都有配置，可定制功能，
我们将这些配置提取出来，统一在 `.elf.config.js` 文件中进行设置。

PS：通过执行 `elf init` 生成的项目，默认会在项目根目录中生成 `.elf.config.js` 文件。
如果是手工创建的项目，也可以在项目中执行 `elf init` 来添加 `.elf.config.js` 文件。
如果原本已经存在，执行 `elf init` 会用默认文件覆盖。

## 雪碧图

合成的雪碧图的使用了 [postcss-sprites](https://github.com/2createStudio/postcss-sprites) 插件。

提供的默认配置

```js
  spritesOptions: {
    // stylesheetPath 不可配置，值为 'src/css/'
    // spritePath 不可配置，值为 'src/img/'，默认以该目录下的子目录作为分组，子目录下的 png 图片会合成雪碧图，非子目录下面的 png 不会合
    // retina 不可配置，值为 true,
    // relativeTo 不可配置，值为 'rule'
    spritesmith: {
      algorithm: 'left-right',
      padding: 1
    }
  },
```

`spritePath` 不可配置，值为 'src/img/'，默认以该目录下的子目录作为分组，子目录下的 png 图片会合成雪碧图，非子目录下面的 png 不会合。
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

## Zepto 扩展

默认引入的 `Zepto` 只包含 [默认的 modules](http://zeptojs.com/#modules)。如果还需要引入其他 `modules`，先在当前项目中安装 `npm i --save zepto.js`，然后在 js 文件中引入

```js
require('zepto.js/src/detect.js')     // 引入 detect
require('zepto.js/src/fx.js')         // 引入 fx
require('zepto.js/src/fx_methods.js') // 引入 fx_methods
```

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
