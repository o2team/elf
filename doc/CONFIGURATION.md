# 配置

`ELF` 基于 `webpack`，同时整合了很多 `webpack 插件`，大部分配置项都跟 `webpack` 和 `webpack 插件` 有关，配置都统一在 `.elf.config.js` 中进行设置。

配置文件格式：

```js
module.exports = {
  // 基础配置
  devPort: '8000',

  // 开发配置
  DEVELOPMENT: {
  },

  // 构建配置
  PRODUCTION: {
  }
}
```

运行 `elf start` 时，使用 `基础配置` 和 `开发配置`，`开发配置` 中的配置项优先级更高。

运行 `elf build` 时，则使用 `基础配置` 和 `构建配置`，`构建配置` 中的配置项优先级更高。





## 基本配置

### devPort

- Type: `Number` or `String`
- Default: `8000`

development server 运行的端口

### designLayoutWidth

- Type: `Number`
- Default: `750`

设计稿的宽度 | 默认750，如果开启 Zoom 则直接按照设计稿宽度和屏幕宽度进行缩放

### designLayoutHeight

- Type: `Number`
- Default: `1206`

设计稿的高度 | 默认1206，如果开启 Zoom 则直接按照设计稿高度和屏幕高度进行缩放

### baseZoomRuler

- Type: `String`
- Default: `width`

Zoom 缩放的基准 | 默认为 'width'，以屏幕的宽度进行缩放

### baseSize

- Type: `Number`
- Default: `10`

计算 rem 的基数，通常不用修改

### enableREM

- Type: `Boolean`
- Default: `true`

是否用 rem 做适配

### enableZoom

- Type: `Boolean`
- Default: `true`

是否用 zoom 做适配

### enableDisplayQR

- Type: `Boolean`
- Default: `false`

配置是否在 Terminal 显示测试链接二维码




## Webpack 基本配置

注意事项

- 涉及到输出文件名的配置项，都支持 [filename-template-placeholders](https://github.com/webpack-contrib/file-loader#filename-template-placeholders)

### entry

> 参考 [`webpack.entry`](https://webpack.js.org/configuration/entry-context/#entry)

- Type: `String` or `Array` or `Object`
- Default: `src/js/main.js`

设置入口文件

### output

> 参考 [`webpack.output`](https://webpack.js.org/configuration/output)

- Type: `String` or `Array` or `Object`
- Default:

```js
  output: {
    path: 'dist',
    publicPath: './',
    filename: 'js/bundle.js'
  }
```

设置 `js` 的输出文件名、目录以及 `publicPath` 等相关配置

### outputCss

- Type: `String`
- Default: `css/app.css`

设置 `css` 的输出文件名

### outputCssPublicPath

- Type: `String`
- Default: `../`

设置构建 `css` 文件时的 `publicPath`

### externals

> 参考 [`webpack.externals`](https://webpack.js.org/configuration/externals)

- Default: `{}`

## Webpack Loader 相关配置

### imgLoaderQuery

- Type: `Object`
- Default:

```js
  imgLoaderQuery: {
    limit: 1000,
    name: 'img/[name].[ext]'
  }
```

处理图片资源 loader 的 options

### audioLoaderQuery

- Type: `Object`
- Default:

```js
  audioLoaderQuery: {
    name: 'plugin/[name].[ext]'
  }
```

处理音频资源 loader 的 options

### imgToBase64Dir

- Type: `RegExp`
- Default: `/src\/img-base64/`

指定目录，该目录下的的图片默认被转成 base64


### rules

> 参考 [`webpack.module.rules`](https://webpack.js.org/configuration/module/#module-rules)

- Default: `[]`

新增 `webpack loader`。当默认提供的 `webpack loader` 无法满需求，通过该配置可以添加自己安装配置的 `loader`。

可参考 [template react](https://github.com/elf-templates/react) 的配置。





## Webpack plugins 相关配置

### commonsChunkPluginOptions

> 参考 [`webpack.CommonsChunkPlugin`](https://webpack.js.org/plugins/commons-chunk-plugin/)

- Default: `null`

配置提取公用模块

### definePluginOptions

> 参考 [`webpack.DefinePlugin`](https://webpack.js.org/plugins/define-plugin)

- Default: `{}`

### cssLoaderOptions

> 参考 [`css-loader`](https://github.com/webpack-contrib/css-loader#options)

- Default: `{}`

### htmlWebpackPluginOptions

> 参考 [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin#configuration)

- Default:

```js
  htmlWebpackPluginOptions: {
    template: 'src/index.html'
  }
```

### enableWebpackVisualizer

> 参考 [`webpack-visualizer`](https://github.com/chrisbateman/webpack-visualizer)

- Type: `Boolean`
- Default: `false`

设置为 `true` 时，会在 `output.path` 生成文件 `webpack-stats.html`，用浏览器打开可以查看构建文件内容的组成。

### plugins

> 参考 [`webpack.plugins`](https://webpack.js.org/configuration/plugins/)

- Default: `[]`

新增 `webpack plugins`。当默认提供的 `webpack plugins` 无法满需求，通过该配置可以添加自己安装配置的 `plugins`。

例如：

```js
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
```




## Postcss plugins 相关配置

### autoprefixerOptions

> postcss 插件，参考 [`autoprefixer`](https://github.com/postcss/autoprefixer)

- Default:

```js
  autoprefixerOptions: {
    browsers: ['iOS >= 5', 'Android >= 2.3'],
    cascade: false
  }
```

### postcss-assets

> postcss 插件，参考 [`postcss-assets`](https://github.com/assetsjs/postcss-assets)

- Default:

```js
  assetsOptions: {
    loadPaths: ['src/img/']
  }
```

获取图片宽高插件配置。提供在样式里使用获取图片宽高的函数。

例如：

```css
body {
  width: width('images/foobar.png'); /* 320px */
  height: height('images/foobar.png'); /* 240px */
  background-size: size('images/foobar.png'); /* 320px 240px */
}
```

### enableSpritesOnDev

- Type: `Boolean`
- Default: `false`

控制是否在 dev 模式时合成雪碧图

### spritesOptions

> postcss 插件，参考 [`postcss-assets`](https://github.com/2createStudio/postcss-sprites)

- Default:

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

雪碧图合成插件配置。

### px2remOptions

> postcss 插件，参考 [`postcss-plugin-px2rem`](https://github.com/ant-tool/postcss-plugin-px2rem)

- Default:

```js
  px2remOptions: {
    // rootValue 由 config.designLayoutWidth / config.baseSize 而来，不用配置
    unitPrecision: 5,
    propWhiteList: [],
    propBlackList: [],
    selectorBlackList: [/.ignore-rem/],
    ignoreIdentifier: false,
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
  }
```


### imageWebpackLoader

> postcss 插件，参考 [`image-webpack-loader`](https://github.com/tcoopman/image-webpack-loader#usage)

> 只在 production 模式生效

- Default:

```js
  PRODUCTION: {
    imageWebpackLoader: {
      mozjpeg: {
        quality: 65
      },
      pngquant: {
        quality: "65-90",
        speed: 4
      },
      svgo: {
        plugins: [{
          removeViewBox: false
        }, {
          removeEmptyAttrs: false
        }]
      },
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7,
        interlaced: false
      }
    }
  }
```

图片压缩插件配置。


### postcssPlugins

> 参考 [`postcss`](https://github.com/postcss/postcss-loader#plugins)

- Default: `[]`

新增 `postcss plugins`。当默认提供的 `postcss plugins` 无法满需求，通过该配置可以添加自己安装配置的 `plugins`。

例如：

```js
  postcssPlugins: [require('postcss-plugin-px2rem')({
    rootValue: 750 / 20
  })]
```

对于 `elf` 不提供的包，需要在当前项目自行安装。




## Webpack 压缩文件相关配置

**压缩文件相关配置只在 production 模式生效**，请配置在 `PRODUCTION` 中，例如：

```js
  PRODUCTION: {
    enableJSCompress: true,
    enableCSSCompress: true,
    enableHTMLCompress: false,
    enableImageMin: false,
  }
```

### enableJSCompress

- Type: `Boolean`
- Default: `true`

控制 `js` 文件是否压缩

### enableCSSCompress

- Type: `Boolean`
- Default: `true`

控制 `css` 文件是否压缩

### enableHTMLCompress

- Type: `Boolean`
- Default: `false`

控制 `html` 文件是否压缩。

需要注意，`htmlWebpackPluginOptions.minify` 也是可以控制 `html` 是否被压缩的，而且同时作用于同一个文件时优先级更高。

### enableImageMin

- Type: `Boolean`
- Default: `false`

控制图片是否压缩。使用 `image-webpack-loader` 进行压缩处理。
