# ELF

针对移动 web 场景的动效模板脚手架，可用来制作翻页动画，各种推广宣传 HTHML5 页面。包括移动端自适应（rem 或 zoom），雪碧图合并，样式 hot reload 等功能，通过 webpack 进行打包发布。
另外还提供翻屏，重力感应等示例项目。

## 安装

```sh
# 全局安装
$ npm install -g elf-cli

# 查看 help
$ elf --help

  Usage: elf [options] [command]


  Commands:

    init|i [options]  init project
    list|ls           list all cases

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -d, --dest [dir]   set destination directory when init, default: .
    -c, --case [case]  set extend case when init


# 创建项目目录
$ mkdir demo && cd demo

# 初始化项目
$ elf init

# 查看已有示例
$ elf list
```

## Boilerplate 介绍

### 主要功能

- [x] 页面响应式 REM px 自动转换 REM （可选）
- [x] 页面响应式 Zoom 对需要缩放部分引用 class="__z" （可选）
- [x] 主要针对移动端 HTML5 网页开发，并专门针对微信做了兼容
- [x] 打包发布，快速配置
- [x] 图片自动分组合并雪碧图
- [x] 图片压缩
- [x] 代码打包压缩
- [x] 样式 hot reload
- [x] sass
- [x] autoprefixer

### 相关组件依赖

- [x] Zepto [参考地址](http://zeptojs.com/)

Zepto，会默认引入，其他可根据项目需求引入

### 目录结构
```bash
.
├── config                                                                           
│   ├── build.js                    # 构建配置                    
│   ├── default.js                  # 默认配置
│   └── development.js              # 开发配置
├── package.json                                       
├── src                                      
│   ├── body.html                   # html body
│   ├── css                                       
│   │   ├── base.css    
│   │   ├── loading.scss                                        
│   │   └── main.scss               # 样式文件
│   ├── img
│   │   └── html5-logo.png
│   ├── index.template.ejs          
│   └── js                                        
│       ├── lib                                       
│       │   └── preloader.js                                        
│       └── main.js                 # 入口 js 文件
├── webpack                                       
│   ├── build.js                                        
│   ├── webpack.base.js             # webpack 基础配置文件                         
│   ├── webpack.config.build.js     # webpack 构建项目配置文件                                 
│   └── webpack.config.dev.js       # webpack 开发配置文件                               
└── yarn.lock                                      
```

### config 说明

#### 开发配置
文件： `config/development.js`
```javascript
{
    TITLE: 'HTML5 SPA Boilerplate DEV',
    PORT: '8000',
    DESIGN_WIDTH: 750,
}

```

**配置项说明**
- TITLE

    设置标题

- PORT

    开发服务器监听的端口

- DESIGN_WIDTH

    设计稿的宽度。用于计算 REM，设置了之后，样式直接使用设计稿的尺寸。
    例如：设计稿的宽度是 750px，其中有个按钮是的宽度是 80px，在设置这个按钮的宽度样式时，直接按 80px 设置。

#### 构建配置
文件： `config/build.js`
```javascript
{
    OUTPUT_PATH: 'dist',
    PUBLIC_PATH: '/'
}
```

**配置项说明**
- OUTPUT_PATH

    构建完成后的输出目录

- PUBLIC_PATH

    静态资源的路径


#### 默认配置
文件：`config/default.js`

默认配置文件提供了默认值，`如果需要修改某个配置项，不要修改默认配置文件，请修改开发配置文件或者构建配置文件`

```javascript

{
    TITLE: 'HTML5 SPA Boilerplate', // 页面标题
    PORT: '8000', // dev server 运行的端口
    DESIGN_WIDTH: 750, // 设计稿的宽度 默认750,如果开启 Zoom 则直接按照设计稿和屏幕宽度进行缩放
    RESPONSIVE_REM: true, // 是否用rem做适配
    RESPONSIVE_ZOOM: true, // 是否用Zoom做适配
    NODE_ENV: process.env.NODE_ENV || 'development',
    PROJECT_ROOT: path.resolve(__dirname, '..'),

    OUTPUT_PATH: 'dist', // build 时，生成的文件夹
    PUBLIC_PATH: '/', // 静态资源路径
    CSS_INTERNAL: false, // build 时，样式是否内联，默认为 false；如果为 true，则将样式附加到 html header 中作为内联样式
    EXTERNALS: {},
    PUBLISH_IMAGEMIN: { // build 时，图片的压缩配置
        optimizationLevel: 7,
        interlaced: false,
        pngquant: {
            quality: "65-90",
            speed: 4
        }
    }
}
```

### 使用说明

```bash
# node6.2.2 +

npm install # 安装依赖

npm start # 项目开发

npm run build # 项目打包
```

PS： node-sass 可能安装会比较慢，如果不行可以用淘宝镜像。

```bash
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass
```

## 演示

## 插件列表
* [webpack](https://webpack.github.io/): is a module bundler
* [css-loader](https://github.com/webpack/css-loader) : css loader module for webpack
* [sass-loader](https://github.com/jtangelder/sass-loader) : SASS loader for Webpack
* [file-loader](https://github.com/webpack/file-loader) : file loader for webpack
* [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) : Image loader module for webpack
* [postcss-loader](https://github.com/postcss/postcss-loader) : PostCSS loader for webpack
* [script-loader](https://github.com/webpack/script-loader) : script loader module for webpack
* [style-loader](https://github.com/webpack/style-loader) : style loader module for webpack
* [url-loader](https://github.com/webpack/url-loader) : url loader module for webpack
* [exports-loader](https://github.com/webpack/exports-loader) : exports loader module for webpack
* [autoprefixer](https://github.com/postcss/autoprefixer) : Parse CSS and add vendor prefixes to rules by Can I Use
* [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) : Extract text from bundle into a file.
* [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) : Simplifies creation of HTML files to serve your webpack bundles
* [lodash](https://lodash.com/): A modern JavaScript utility library delivering modularity, performance & extras
* [postcss-import](https://github.com/postcss/postcss-import) : PostCSS plugin to inline @import rules content
* [postcss-plugin-px2rem](https://github.com/ant-tool/postcss-plugin-px2rem) : postcss plugin px2rem
* [postcss-sprites](https://github.com/2createStudio/postcss-sprites) : Generate sprites from stylesheets.
* [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) : The webpack-dev-server is a little node.js Express server
