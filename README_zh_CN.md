[English](README.md)

# 文档别名

<img src="./icon.png" width="160" height="160" alt="icon">

听说给我起个新名字，你更容易找到我☺️

## 核心特色

- **自动别名**：默认生成三个，英文、拼音和拼音首字母
  - 1 自动生成 `英文翻译` + `hash` 的别名，保存到 `name` 和 `custom-slug` 属性中。
  - 2 自动生成 `pinyin` + `hash` 的别名，保存到 `alias` 属性中。
  - 2 自动生成 `拼音首字母` + `hash` 的别名，保存到 `alias` 属性中。
  
  注1：额外保存一个 `custom-slug` 这个key，是为了与发布工具插件兼容。

  注2：hash 的目的是防止两篇文档别名重复。就像现实中你喊两个名字一样的人，谁答应好呢，哈哈，是吧

- **支持查看**：在右键菜单中，可查看并修改当前设置的命名和别名

## FAQ

* Q1：做这个插件的缘起是什么？

  A1：参考 [新建文件自动加入拼音做别名](https://github.com/siyuan-note/siyuan/issues/8396) 。如果自动生成了别名，在开启别名搜索之后，可以大大的提升效率。因为，你想啊，打一个英文字符或者拼音，肯定比汉字来得快吧是吧。

* Q2：新建文档时候能自动生成吗？

  A2：支持。v0.0.3 支持重命名标题的时候自动生成。当然您也可以点击顶栏按钮生成。

* Q3：自动生成的 key 为什么不能改？

  A3：这个是为了和后续的发布工具兼容，而且这个 key 其实只是开发者关心的，普通用户并无明显感知，只是一个约定而已。当然，如果强烈要求改的话，后续版本也可考虑支持自定义命名 key 。注意：非自定义属性的 key 不可修改。

* Q4：怎么开启别名搜索？

  A4：到 `设置` -> `搜索` 里面，可以找到开启别名搜索的开关，您可以选择命名、别名以及自定义属性。

  ![](./assets/slug-setting.png)

## 更新历史

**v0.1.0 主要更新**

### 特性
- 提供友好的错误提示 ([16fa881](https://github.com/terwer/siyuan-plugin-custom-slug/commit/16fa881e4f5da189caba014136f31e54388449dc))
- 支持重命名文档标题的时候自动生成别名 ([b3ceab4](https://github.com/terwer/siyuan-plugin-custom-slug/commit/b3ceab4e7dcba0a8df5103abc4a838943e824279))

**v0.0.2 主要更新**

### 特性
- 补充部分国际化资源 ([b61cfad](https://github.com/terwer/siyuan-plugin-custom-slug/commit/b61cfad795185878e7ec7ca55e158e32d8934de0))
- 调整预览图、图标尺寸 ([f219a40](https://github.com/terwer/siyuan-plugin-custom-slug/commit/f219a40cbf6f15ecc8bee3c996d352ae83699124))
### 重构
- 修复构建错误 ([a8ea298](https://github.com/terwer/siyuan-plugin-custom-slug/commit/a8ea2988bffbf0372b1c90b885248c1af9afcc39))

**v0.0.1 主要更新**

- 第一个版本

更多更新记录请查看 [CHANGELOG](https://github.com/terwer/siyuan-plugin-custom-slug/blob/main/CHANGELOG.md)

## 捐赠

如果您认可这个项目，请我喝一杯咖啡吧，这将鼓励我持续更新，并创作出更多好用的工具~

### 微信

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/wechat.jpg" alt="wechat" style="width:280px;height:375px;" />
</div>

### 支付宝

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/alipay.jpg" alt="alipay" style="width:280px;height:375px;" />
</div>

## 感谢

感谢 [frostime](https://github.com/siyuan-note/plugin-sample-vite-svelte) 提供的项目模板