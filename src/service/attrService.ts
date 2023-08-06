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
import { confirm, showMessage } from "siyuan"
import SlugPlugin from "../index"
import { generateCurrentTime } from "../utils/utils"
import shortHash from "shorthash2"
import { ConfigManager } from "../store/config"
import { updateStatusBar } from "../statusBar"
import { AliasTranslator, StrUtil } from "zhi-common"

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

  public static async batchGenerateAttrs(pluginInstance: SlugPlugin) {
    const settingConfig = (await ConfigManager.loadConfig(pluginInstance)) as any
    const lastUpdated = settingConfig?.lastUpdated ?? ""

    try {
      const unnamedCount = await pluginInstance.kernelApi.getUnnamedRootBlocksCount(lastUpdated)
      if (unnamedCount === 0) {
        showMessage("没有需要处理的文档", 3000, "info")
        return
      }
      const desc = pluginInstance.i18n.batchTipDescription
        .replace("[docCount]", unnamedCount)
        .replace("[lastUpdated]", lastUpdated === "" ? "-" : lastUpdated)
      confirm(pluginInstance.i18n.batchTipTitle, desc, async () => {
        const pageSize = 10
        let currentCount = 0 // 初始化 currentCount
        for (let offset = 0; offset < unnamedCount; offset += pageSize) {
          const unnamedResult = await pluginInstance.kernelApi.getUnnamedRootBlockIds(lastUpdated, offset)
          pluginInstance.logger.debug("unnamedResult=>", unnamedResult)
          // 在这里处理每一页的结果
          if (unnamedResult && unnamedResult.data && unnamedResult.data.length > 0) {
            for (const pageIdResult of unnamedResult.data) {
              const pageId = pageIdResult.root_id
              updateStatusBar(pluginInstance, `准备为 ${pageId} 生成别名，请稍后...`)

              // 对每个pageId调用doGenerateAttrsById
              const result = await this.doGenerateAttrsById(pluginInstance, pageId)
              if (!result) {
                pluginInstance.logger.error(`生成别名失败，pageId: ${pageId}`)
              } else {
                currentCount++ // 更新 currentCount
              }

              updateStatusBar(
                pluginInstance,
                `文档 ${pageId} 生成别名已完成，当前第 [${offset + currentCount}/${unnamedCount}] 个`
              )
            }
          }
        }

        // 处理完毕更新时间
        const current = generateCurrentTime()
        settingConfig.lastUpdated = current
        await ConfigManager.saveConfig(pluginInstance, settingConfig)
        updateStatusBar(pluginInstance, `别名生成全部完成.`)
      })
    } catch (e) {
      pluginInstance.logger.error("批量生成别名失败", e)
      showMessage("批量生成别名失败", 7000, "error")
    }
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

      const title = page.content
      const slugTitle = await AliasTranslator.wordSlugify(title)
      const pinyinTitle = AliasTranslator.pinyinSlugify(title)
      const pinyinInitialsTitle = StrUtil.getFirstLetters(pinyinTitle)

      const newstr = page.content + new Date().toISOString()
      const hashstr = ["-", shortHash(newstr).toLowerCase()].join("")

      const slug = slugTitle + hashstr
      const pinyin = pinyinTitle + hashstr
      const pinyinInitials = pinyinInitialsTitle + hashstr

      const nameSwitch = settingConfig?.nameSwitch ?? false
      const clearName = settingConfig?.clearName ?? false
      const removePinyinSplit = settingConfig?.removePinyinSplit ?? false

      const attName = slug
      const attAlias = [removePinyinSplit ? pinyin.replace(/-/g, "") : pinyin, pinyinInitials].join()
      await this.doSaveAttrs(pluginInstance, pageId, attName, attAlias, nameSwitch, clearName)
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
   * @param pageId 文档ID
   * @param attName 属性名
   * @param attAlias 属性别名
   * @param nameSwitch 名称开关
   * @param clearName 清除名称
   */
  public static async doSaveAttrs(
    pluginInstance: SlugPlugin,
    pageId: string,
    attName: string,
    attAlias: string,
    nameSwitch: boolean,
    clearName: boolean
  ) {
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
