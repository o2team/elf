# ELF-CLI [![NPM version][npm-version-image]][npm-version-url]

面向开发者的灵活可扩展的 HTML5 构建工具，提供命令行工具 elf（基于 Webpack），**无需配置并可进行开发构建**，
可用来制作各种 HTML5 场景营销活动页面，也可自由的通过模板和组件的组合来快速定制开发。

## 安装

> **`强烈建议`**
由于依赖的包比较多，推荐使用淘宝的 npm 镜像进行安装，执行 npm 安装命令时带上 `--registry=https://registry.npm.taobao.org`。
另外 `node-sass` 和 `phantomjs` 这两个包需要编译，会很耗时，
可以设置 `SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/` 
和 `PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/`，安装已经编译好的版本。

```sh
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/ npm install -g elf-cli --registry=https://registry.npm.taobao.org
```

```sh
# 全局安装 Node >= 4
$ npm install -g elf-cli --registry=https://registry.npm.taobao.org

# 初始化项目
$ elf init demo

# 安装依赖
$ cd demo && npm install

# 运行
$ elf start
```

```sh
# 查看 help
$ elf --help

  Usage: elf [options] [command]


  Commands:

    init        init project
    list        list all templates
    start       run on develpoment mode
    build       build for production
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    # Init project
    $ elf init

    # Base on template init project
    $ elf init -t panorama

    # See all templates
    $ elf list

    # See subcommand help
    $ elf help init

```

## 介绍

### 主要功能

- **微信友好性**

  主要针对移动端 HTML5 网页开发，并专门针对微信做了兼容

- **响应式**

  提供了两种方案：基于 REM，px 自动转换 REM；基于 Zoom，对需要缩放部分引用 class="__z"

  PS: 默认设计稿的宽度是 750px，如果有个按钮是的宽度是 80px，在设置这个按钮的宽度样式时，样式里直接按 80px 设置就好

- 样式预处理

  支持 Sass、Less 或 Stylus 样式预处理语言及 autoprefixer

- **Webpack构建**

  基于 Webpack 进行自动化构建。开发模式时，支持样式 hot reload；雪碧图合并。构建时，支持代码合并，代码压缩，图片压缩等特性

### 相关组件依赖

- [Zepto](http://zeptojs.com/)

  默认引入，其他可根据项目需求引入

### 目录结构

```sh
.
├── README.md
├── package.json
└── src
    ├── css
    │   └── main.scss               # 引入的样式文件（在 main.js 中）
    ├── img
    ├── index.html                  # html 模板
    └── js
        └── main.js                 # 入口 js 文件
```

## 感谢

项目的灵感和某些 Webpack 的配置来至 [create-react-app](https://github.com/facebookincubator/create-react-app)

## 许可

MIT


[npm-version-image]: https://img.shields.io/npm/v/elf-cli.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/elf-cli
