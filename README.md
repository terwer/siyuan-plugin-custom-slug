[中文](README_zh_CN.md)

# siyuan-plugin-custom-slug

![](https://raw.githubusercontent.com/terwer/siyuan-plugin-custom-slug/main/icon.png)

I heard give me a new name, it will be easier for you to find me ☺️

## Core Features

- **Auto Alias**: Generate two by default, English and Pinyin
  - 1 Automatically generate an alias of `English translation` + `hash` and save it in the `custom-slug` attribute.
  - 2 Automatically generate an alias of `pingyin` + `hash` and save it in the `custom-pingyin` attribute.

  Note 1: Use the `custom-slug` key for saving, which is compatible with the `siyuan-plugin-publisher` plugin.

  Note 2: The purpose of hash is to prevent duplicate aliases of two documents. Just like in reality, if you call two people with the same name, who will agree, haha, right?

- **Support Configuration**: In the right-click menu, you can customize other aliases and save them in the `custom-nicknames` property, separated by `,` commas in English

## FAQ

* Q1: What is the origin of this plugin?

  A1: Refer to [Automatically add pinyin as aliases to new files](https://github.com/siyuan-note/siyuan/issues/8396). If the alias is automatically generated, after the alias search is enabled, the efficiency can be greatly improved. Because, you think, if you type an English character or pinyin, it will be quickly than Chinese characters, right?

* Q2: Can it be automatically generated when creating a new document?

  A2: This cannot be done temporarily. Moreover, there may be users who don't want to generate every document. So provide the top bar button, click to generate automatically.

* Q3: Why can't the automatically generated key be changed?

  A3: This is for compatibility with subsequent `siyuan-plugin-publisher` plugin , and this key is actually only a developer relationship. Ordinary users actually have no obvious perception, it is just a convention. Of course, if there is a strong demand for changes, subsequent versions may consider supporting custom named keys.

* Q4: How to enable alias search?

  A4: Go to `Settings` -> `Search`, you can turn on the alias switch.

  ![](https://raw.githubusercontent.com/terwer/siyuan-plugin-custom-slug/main/asset/slug-setting.png)

## Changelog

**v0.0.1 major update**

- first version

For more update records, please check [CHANGELOG](https://github.com/terwer/siyuan-plugin-custom-slug/blob/main/CHANGELOG.md)

## Donate

If you approve of this project, invite me to have a cup of coffee, which will encourage me to keep updating and create
more useful tools~

### Wechat

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/wechat.jpg" alt="wechat" style="width:280px;height:375px;" />
</div>

### Alipay

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/alipay.jpg" alt="alipay" style="width:280px;height:375px;" />
</div>

## Thanks

Thanks to [frostime](https://github.com/siyuan-note/plugin-sample-vite-svelte) for the project template