<p align="center">
  <a href="https://elf.aotu.io">
    <img alt="ELF" src="https://misc.aotu.io/booxood/elf/logo.png" width="200">
  </a>
</p>

ELF - 面向开发者的灵活可扩展的 HTML5 构建工具，提供命令行工具 elf（基于 Webpack），**无需构建配置文件并可进行开发**，可用来制作各种 HTML5 场景营销活动页面，也可自由的通过模板和组件的组合来快速定制开发。

## 安装 [![NPM version][npm-version-image]][npm-version-url]

> **`提醒`**
由于依赖的包比较多，第一次安装耗时很长很长，请稍微耐心等待一下。
推荐使用淘宝的 npm 镜像进行安装，执行 npm 安装命令时带上 `--registry=https://registry.npm.taobao.org`。
另外 `node-sass` 和 `phantomjs` 这两个包需要编译，可以设置 `SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/`
和 `PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/`，安装已经编译好的版本。

```sh
# 全局安装 Node >= 6
# mac/linux
$ SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/ npm install -g elf-cli --registry=https://registry.npm.taobao.org
# windows
$ npm install -g elf-cli --registry=https://registry.npm.taobao.org --SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ --PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/

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

    # List all templates
    $ elf list

    # See subcommand help
    $ elf help init

```

## 介绍

### 主要功能

- 开发时样式热加载
- 支持 Sass、Less 和 Stylus 样式预处理自动编译
- Autoprefixer 前缀补全
- px -> rem 自动转换
- 雪碧图合成
- 自动获取图片 width 和 height
- 部署构建时图片压缩
- 部署构建时代码合并压缩

### 相关组件依赖

- [Zepto](http://zeptojs.com/)

  默认引入，其他可根据项目需求引入

### 基础目录结构

很多预制的功能与目录结构相关，请确认项目包含以下文件和目录，否则可能执行失败。

```sh
.
├── package.json
└── src
    ├── css
    │   └── main.scss               # 引入的样式文件（在 main.js 中）
    ├── img                         # 图片 资源的目录
    ├── plugin                      # 音频 资源的目录（可选）
    ├── index.html                  # html 模板
    └── js
        └── main.js                 # 入口 js 文件
```

[**查看更详细的说明**](https://github.com/o2team/elf/blob/master/doc/DETAIL.md)

## 感谢

项目的灵感和某些 Webpack 的配置来自 [create-react-app](https://github.com/facebookincubator/create-react-app)

## 许可

MIT

[npm-version-image]: https://img.shields.io/npm/v/elf-cli.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/elf-cli
