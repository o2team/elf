# 1.9.0 - 2017-09-13

## Feature

- definePlugin 添加 ELF_ENV 变量
- 增加预置样式 .__s

## Break Changes

- 调整默认配置项

  - assetsOptions.cache 设为 true
  - px2remOptions.minPixelValue 设为 2

# 1.8.0 - 2017-07-22

## Feature

- 支持生成构建文件压缩包

## Refactor

- 精简默认生成的配置文件

## Performance

- 引入压缩版的 zepto
- 升级依赖的 package，其中包括：webpack3


# 1.7.0 - 2017-06-06

配置文件很多修改，具体可查看 [文档](https://github.com/o2team/elf/blob/master/doc/CONFIGURATION.md)

## Feature

- 增加配置项 plugins 和 postcssPlugins
- 新增命令行参数 debug
- 新增配置项 enableWebpackVisualizer
- 增加配置项 rules
- 增加配置项 definePluginOptions
- 增加配置项 cssLoaderOptions
- 增加配置项控制是否压缩文件

## Break Changes

- 修改一些默认配置项的值

  - 去掉所有的 [hash:6]
  - commonsChunkPluginOptions 修改为 null
  - 去掉 PRODUCTION.htmlWebpackPluginOptions
  - enableImageMin 修改为 false
  - uglifyjsPluginOptions 修改为 {}

## Fixed

- commonsChunkPluginOptions 合并不正确

  当配置 commonsChunkPluginOptions 为 Object 类型时，与默认的 [] 不能正确合并

## Revert

- 换回之前使用的获取局域网 ip 库

  两个库（ip，internal-ip）在某些情况下都会有问题，跟运行环境的网络设置有关
  当有多个内网地址时，ip 是取第一个内网地址，internal-ip 是取最后一个
  大多数时候前一种方式更适用

# 1.6.1 - 2017-05-23

## Feature

- 增加配置项 uglifyjsPluginOptions

# 1.6.0 - 2017-05-04

## Feature

- 支持生成多个页面
- 支持配置 webpack.CommonsChunk 插件

## Refactor

- 开发模式时 entry 添加 hot reload 相关文件

## Fixed

- entry 可以设置为数组或者对象
- 更新依赖 webpack@2.4.1 [#20](https://github.com/o2team/elf/issues/20)


# 1.5.2 - 2017-04-13

## Feature

- 增加 npm-install-webpack-plugin 插件

## Breaking Changes

- 更新 webpack2

  配置文件参考 [新文档](https://webpack.js.org/configuration/)


# 1.4.0 - 2017-03-20

## Feature

- 增加新版提示

## Fixed

- 修复引入 zepto 的路径 [#11](https://github.com/o2team/elf/issues/11) [#13](https://github.com/o2team/elf/issues/13)
