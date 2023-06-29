/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import PageUtil from "../utils/pageUtil"
import { showMessage } from "siyuan"
import SlugPlugin from "../index"
import { getFirstLetters, pinyinSlugify, removeTitleNumber, zhSlugify } from "../utils/utils"
import shortHash from "shorthash2"
import { ConfigManager } from "../store/config"

/**
 * AttrService类提供了自动生成和保存属性的方法
 */
export class AttrService {
  /**
   * 自动为给定的插件实例生成属性
   *
   * @param pluginInstance SlugPlugin的实例
   * @returns 返回一个布尔值，表示是否成功生成属性
   */
  public static async autoGenerateAttrs(pluginInstance: SlugPlugin) {
    let flag = true

    const pageId = PageUtil.getPageId()
    if (!pageId) {
      showMessage(`${pluginInstance.i18n.tipsErrOpenDoc}`, 7000, "error")
      flag = false
      return flag
    }

    return this.doGenerateAttrsById(pluginInstance, pageId)
  }

  /**
   * 根据给定的页面ID为插件实例生成属性
   *
   * @param pluginInstance SlugPlugin的实例
   * @param pageId 页面的ID
   * @returns 返回一个布尔值，表示是否成功生成属性
   */
  public static async doGenerateAttrsById(pluginInstance: SlugPlugin, pageId: string) {
    let flag = true
    try {
      // 读取配置
      const settingConfig = (await ConfigManager.loadConfig(pluginInstance)) as any

      const pageData = await pluginInstance.kernelApi.getBlockByID(pageId)
      if (pageData.code !== 0 || (pageData.data as any).length == 0) {
        showMessage(`${pluginInstance.i18n.tipsPageInfoError}`)
        flag = false
        return flag
      }
      const page = pageData.data[0] as any
      pluginInstance.logger.debug("page=>", page)

      const title = removeTitleNumber(page.content).trim()

      const newstr = page.content + new Date().toISOString()
      const hashstr = ["-", shortHash(newstr).toLowerCase()].join("")

      const slugTitle = await zhSlugify(title)
      const pinyinTitle = pinyinSlugify(title)
      const pinyinInitialsTitle = getFirstLetters(pinyinTitle)

      const slug = slugTitle + hashstr
      const pinyin = pinyinTitle + hashstr
      const pinyinInitials = pinyinInitialsTitle + hashstr

      const nameSwitch = settingConfig?.nameSwitch ?? false
      const clearName = settingConfig?.clearName ?? false
      const removePinyinSplit = settingConfig?.removePinyinSplit ?? false

      const attName = slug
      const attAlias = [removePinyinSplit ? pinyin.replace(/-/g, "") : pinyin, pinyinInitials].join()
      await this.doSaveAttrs(pluginInstance, attName, attAlias, nameSwitch, clearName)
    } catch (e) {
      showMessage(`${pluginInstance.i18n.tipsSlugGenerateError} => ${e.toString()}`, 7000, "error")
      flag = false
    }
    return flag
  }

  /**
   * 保存给定的属性
   *
   * @param pluginInstance SlugPlugin的实例
   * @param attName 属性名
   * @param attAlias 属性别名
   * @param nameSwitch 名称开关
   * @param clearName 清除名称
   */
  public static async doSaveAttrs(
    pluginInstance: SlugPlugin,
    attName: string,
    attAlias: string,
    nameSwitch: boolean,
    clearName: boolean
  ) {
    const pageId = PageUtil.getPageId()
    let customAttrs = {
      alias: attAlias,
      "custom-slug": attName,
    }

    // 未禁用命名
    if (!nameSwitch) {
      customAttrs = {
        ...customAttrs,
        ...{
          name: attName,
        },
      }
    }

    // 强制清空
    if (clearName) {
      customAttrs = {
        ...customAttrs,
        ...{
          name: "",
        },
      }
    }

    const data = await pluginInstance.kernelApi.setBlockAttrs(pageId, customAttrs)
    if (data.code !== 0) {
      showMessage(`${pluginInstance.i18n.tipsAttrsFetchError} => ${data.msg}`, 7000, "error")
      return
    }
  }
}
