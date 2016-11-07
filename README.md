
## H5活动脚手架

针对微信移动web场景的动效模板脚手架，可用来制作翻页动画，各种推广宣传H5页面。包括移动端自适应（rem 或 zoom），雪碧图合并，hot reload，以及翻屏组件，重力感应，微信分享等一系列的开发库，通过webpack进行打包发布。

基于webpack，同时加了一些市面上比较好的公用组件库，以及自己开发定制的组件，可选择性引用，这里只需关注业务逻辑，其他的已经帮你做好了！


**『 Boilerplate 主要功能 』**

- [x] 页面响应式REM px自动转换REM （可选）
- [x] 页面响应式Zoom 对需要缩放部分引用class="__z" （可选）
- [x] 主要针对移动端H5网页开发，并专门针对微信做了兼容
- [x] 打包发布，快速配置
- [x] hot reload
- [x] 图片自动分组合并雪碧图
- [x] 图片压缩
- [x] 代码打包压缩
- [x] sass
- [x] autoprefixer

**『 相关组件 』** 

- [x] Zepto [参考地址](http://zeptojs.com/)
- [x] Motion 组件库（横屏，资源预加载，滚动加载等）[参考地址](http://tgideas.github.io/motion/)
- [x] swiper组件 [参考地址](https://github.com/nolimits4web/Swiper)
- [x] Greensock 动画库 [参考地址](https://greensock.com/)
- [x] anime 动画库 [参考地址](http://anime-js.com/)
- [x] 重力感应 [参考地址](https://github.com/shrekshrek/orienter)
- [x] Threejs WebGl，3D动画库 [参考地址](https://threejs.org/)
- [x] slider 轻量级自定义翻屏库，每一屏都包含out和in的进出场动画衔接
- [x] 微信组件（分享 + 发邮件 + 关闭当前view + 获取网络类型 + 图片查看器）
- [x] Launcher, 快速配置组件，直接包含（微信分享 + loading + PC端展示样式 + 背景音乐 + 预加载）

Zepto，会默认引入，其他可根据项目需求引入

**『 UI组件 』** (后面会引用更多的UI组件)

- [x] loading 
- [x] 横屏样式 
- [x] 微信分享样式 
- [x] 移动端页面PC端打开显示扫描二维码 

### 『 系统配置说明 』

./config/config.js 配置文件

```javascript
{
    DEV:{ // 开发环境配置
        IP: 'xx.xx.xx.xx', // 可配置本机IP，默认localhost
        PROJECTPATH: 'example-inout-slider' // 项目开发路径
    },
    PRODUCTION:{ // 线上环境配置
        PUBLICPATH: 'http://l-zhi.com/',
        PROJECTPATH: 'example-inout-slider' // 项目发布路径
    }
}

// 其他可选配置项如下：
{
    TITLE:'O2-示例', // 页面标题
    PUBLICPATH: '/', // 静态资源地址，非通天塔使用参数, npm run build-ttt 忽略此参数
    NODE_ENV : process.env.NODE_ENV || 'development',
    RESPONSIVE_REM: true, //是否用rem做适配
    RESPONSIVE_ZOOM: false, //是否用Zoom做适配
    OUTPUT_PATH: 'project', // 输出项目文件名
    PORT: '3007', // 开发环境端口
    DESIGN_WIDTH: 750, // 设计稿的宽度，默认750，也可以设置其他的比如 640，设置后，可直接根据实际设计稿宽高写样式，前提是开启rem 或者 zoom 缩放
    IP:'localhost', //默认 localhost
    PUBLISH_IMAGEMIN: { // 发布的图片压缩配置
        optimizationLevel: 7, 
        interlaced: false,
        pngquant:{
            quality: "65-90",
            speed: 4
        }
    }
}
```

#### 『 目录结构 』
```bash
.
├── project                     # build 之后目录结构
│   ├── css
│   ├── js
│   ├── plugin
│   ├── img
│   └── index.html
├── config                      # 项目配置（包括响应式开发配置）
├── src                         # 源代码
│   ├── common                  # 公用组件    
│   │   ├── css
│   │   ├── img
│   │   ├── js
│   │   └── template            # 公用模板
│   ├── example-all             # 组件示例
│   ├── example-inout-slider    # slider in-out 可以此作为开发基础模板
│   │   ├── css
│   │   ├── img
│   │   │   └── icon            # 需要合雪碧图的图片放在这里，其他图片放在根目录下
│   │   ├── js
│   │   ├── plugin              # 存放mp3 等其他资源文件
│   │   └── index.html          # html模板文件， .container 中的内容
│   └── example-threejs         # Threejs 3D 示例
│
├── webpack.base.js             # webpack基础配置文件 
├── webpack.config.dev.js       # webpack开发配置文件
└── webpack.config.build.js     # webpack构建项目配置文件  
```

### 『 项目基本配置（可选，如果非微信可自行配置） 』
```javascript

// 基本配置， 可使用公共组建Launcher， 使用后可直接进行配置无需关心基础功能实现
var Launcher = require('../../common/js/Launcher.js')
Launcher({
    PCQRcode:'', // PC端访问展示的二维码, 默认为连接地址
    
    bgMusic: 'plugin/bg.mp3', // 背景音乐
    
    hasMusic:false, //是否添加背景音乐
    
    loadResources: ['../img/sprite.icon.png','../img/spritesheet_grant.png','../img/logo.png','plugin/bg.mp3'], // 预加载图片

    isMusicPlay: false, // 默认是否打开背景音乐

    loadType: 0,//0为并行， 1为串行 预加载

    concurrency: 2, //并行图片同时加载数

    share_data: { // 微信分享, 因为微信分享是有域名限制的，所以请去微信官网申请
        'img': 'http://h5.m.jd.com/active/2G81HfPDtVb2HtcNrvka9ikam56u/pages/14313/img/logo.jpeg',   // 选填，默认为空或者当前页面第一张图片
        'link': window.location.href,
        'desc': '感谢支持',
        'title': 'O2H5-Boilerplate'
    },

    callback : start // 加载完后的回调函数
})

```

### 『 使用说明 』

开发中可直接复制 example-base 作为基础开发模板，迭代项目。

```bash
# node6.2.2 +

npm install

npm start # 项目开发

npm run build # 项目打包
```

PS： node-sass 可能安装会比较慢，如果不行可以用淘宝镜像。

```bash
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass
```

#### Slider 组件使用说明
做活动经常不是翻屏动画，而是进出场衔接动画，所以开发了此库，参看 example-inout-slider
```javascript
// slider 调用方式，页面都是从 in -> out 
function start(){
    //TODO 初始化滑屏幕组件
    new Slider('.slider', {
        sliderOut: function(slider, idx){
            page.get(idx).slideOut($.proxy(slider.countinue, slider))
        },
        sliderIn: function(slider, idx){
            page.get(idx).slideIn()
        },
        resetSlider: function(slider, idx){
            page.get(idx).reset()
        }
    })
}
```
常规的翻屏可以用回swiper

### 『 发布说明 』
```bash
npm run build
```
发布的时候代码可以直接用 **./project** （默认发布代码地址）

**『 演示 』**

下面的是各种简单示例，扫一下吧~

Examples-all:

![扫一扫](http://img11.360buyimg.com/jdphoto/s194x195_jfs/t3505/22/345911806/6642/894c6a6c/580733e7N0150e47b.png)

Examples-threejs:

![扫一扫](http://img11.360buyimg.com/jdphoto/s192x193_jfs/t3724/272/981318967/4210/13d5f89d/58199d9cN1ca8fb35.png)

Examples-inout-slider:

![扫一扫](http://img11.360buyimg.com/jdphoto/s196x193_jfs/t3646/14/954371307/4087/a8d75613/5819acccN9c4a6c55.png)

Examples-1:

![扫一扫](http://img11.360buyimg.com/jdphoto/s196x197_jfs/t3691/12/1002202878/4204/f2f29abe/58199f1dN5c6c8f86.png)

其他:

![扫一扫](http://img11.360buyimg.com/jdphoto/s193x194_jfs/t3349/256/936515502/4035/950cc046/5819adb7Nfc4c79da.png)

#### 『 插件列表 』
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

以及其他引用的第三方库
- Zepto [参考地址](http://zeptojs.com/)
- Motion 组件库 [参考地址](http://tgideas.github.io/motion/)
- swiper组件 [参考地址](https://github.com/nolimits4web/Swiper)
- Greensock 动画库 [参考地址](https://greensock.com/)
- anime 动画库 [参考地址](http://anime-js.com/)
- 重力感应 [参考地址](https://github.com/shrekshrek/orienter)
- Threejs WebGl，3D动画库 [参考地址](https://threejs.org/)

ｂ（￣▽￣）ｄ 感谢！~
