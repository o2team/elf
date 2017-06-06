const allConfig = require('../config/index.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const webpack = require('webpack')
const zeptoPath = require.resolve('zepto')
const _ = require('lodash')

const headJavascript = `
<!-- begin REM Zoom 计算 -->
<script type="text/javascript">
  (function (win) {
    var remCalc = {};
    var docEl = win.document.documentElement,
      tid,
      hasRem = ${allConfig.enableREM},
      hasZoom = ${allConfig.enableZoom},
      zoomRuler = '${allConfig.baseZoomRuler}',
      designWidth = ${allConfig.designLayoutWidth},
      designHeight = ${allConfig.designLayoutHeight};

    function refresh() {
      var width = docEl.clientWidth;
      var height = docEl.clientHeight;
      if (width > 768) { width = 768 }
      if (hasRem) {
        var rem = width / ${allConfig.baseSize};
        docEl.style.fontSize = rem + "px";
        remCalc.rem = rem;
        var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
        if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
          var remScaled = rem * rem / actualSize;
          docEl.style.fontSize = remScaled + "px"
        }
      }
      if (hasZoom) {
        var style = document.getElementById('J__style')
        if (!style) {
          style = document.createElement('style')
          style.id = 'J__style'
        }
        if (zoomRuler === 'height') {
          style.innerHTML = '.__z{zoom:' + height / designHeight + '}'
        } else {
          style.innerHTML = '.__z{zoom:' + width / designWidth + '}'
        }
        document.getElementsByTagName('head')[0].appendChild(style)
      }
    }

    function dbcRefresh() {
      clearTimeout(tid);
      tid = setTimeout(refresh, 100)
    }
    win.addEventListener("resize", function () {
      dbcRefresh()
    }, false);

    win.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        dbcRefresh()
      }
    }, false);
    refresh();
    if (hasRem) {
      remCalc.refresh = refresh;
      remCalc.rem2px = function (d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === "string" && d.match(/rem$/)) {
          val += "px"
        }
        return val
      };
      remCalc.px2rem = function (d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === "string" && d.match(/px$/)) {
          val += "rem"
        }
        return val
      };
      win.remCalc = remCalc
    }
  })(window);

</script>
<!-- end REM Zoom 计算 -->
`

function HeadJavascriptInjectPlugin(options) {
  // Configure your plugin with options...
}

HeadJavascriptInjectPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
      let html = htmlPluginData.html
      html = html.replace('{{{__HEAD_JAVASCRIPT__}}}', headJavascript)
      htmlPluginData.html = html
      callback(null, htmlPluginData)
    })
  })
}

const addOneOrMorePlugins = _.curry(function (pluginClass, plugins, options) {
  if (_.isArray(options)) {
    Array.prototype.push.apply(plugins, options.map(function (c) {
      return new pluginClass(c)
    }))
  } else if (options) {
    plugins.push(new pluginClass(options))
  }
  return plugins
})

const addHtmlWebpackPlugins = addOneOrMorePlugins(HtmlWebpackPlugin)

const addCommonChunkPlugins = addOneOrMorePlugins(webpack.optimize.CommonsChunkPlugin)

const getPlugins = function (config) {
  var plugins = [].concat(config.plugins)

  plugins.push(new webpack.DefinePlugin(config.definePluginOptions))
  plugins.push(new HeadJavascriptInjectPlugin())
  plugins.push(new webpack.ProvidePlugin({
    $: zeptoPath,
    Zepto: zeptoPath,
    'window.Zepto': zeptoPath
  }))
  config.enableWebpackVisualizer && plugins.push(new Visualizer({
    filename: './webpack-stats.html'
  }))

  addHtmlWebpackPlugins(plugins, config.htmlWebpackPluginOptions)
  addCommonChunkPlugins(plugins, config.commonsChunkPluginOptions)

  return plugins
}

exports.HeadJavascriptInjectPlugin = HeadJavascriptInjectPlugin
exports.getPlugins = getPlugins
