# 开发说明

整个项目主要包含两块：
- base，最基本功能的代码集合
- cases，基于 base 开发的各种示例

开发时主要围绕着这两块进行。

## 新增 case

假如现在要增加一个叫 demo 的 case，执行
`npm run sync cases/demo`


## 修改 base

因为 cases 都是基于 base 而来的，所以，当修改了 base 后，有些改动是需要同步到 cases 的。

在 base 目录下有一个文件 `asserts.json`，定义了同步规则
```json
{
    "asserts": [{
        "path": "config",
        "type": "dir"
    }, {
        "path": "config/default.js",
        "type": "file",
        "action": "force"
    }
    ...
    {
        "path": "package.json",
        "type": "json",
        "action": "assignFields",
        "assignFields": ["devDependencies"]
    }, {
        "path": "yarn.lock",
        "type": "file"
    }]
}
```
默认情况下， 当目标目录存在对应的文件时，就不会再生成新文件了。如果需要改变这种行为，可以设置 `action`。

`action` 的说明：
-  `force`，则会直接覆盖旧的文件
-  `assignFields`，配合字段 `"assignFields": ["devDependencies"] ` 应用于 `json` 文件，合并对应字段。

当修改了 base 的代码后，同步更新到所有 cases 时，执行
`npm run sync:all`

同步到单个时，执行
`npm run sync cases/demo`

