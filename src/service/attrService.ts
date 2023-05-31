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

/**
 * 属性保存
 */
export class AttrService {
  public static async autoGenerateAttrs(pluginInstance: SlugPlugin) {
    let flag = true
    try {
      const pageId = PageUtil.getPageId()
      if (!pageId) {
        showMessage(`请先打开一个文档！`, 7000, "error")
        flag = false
        return flag
      }

      showMessage(`自动生成别名中，请稍后...`, 1000, "info")
      const pageData = await pluginInstance.kernelApi.getBlockByID(pageId)
      if (pageData.code !== 0 || (pageData.data as any).length == 0) {
        showMessage(`页面信息获取失败`)
        flag = false
        return flag
      }
      const page = pageData.data[0] as any
      pluginInstance.logger.info("page=>", page)

      const title = removeTitleNumber(page.content).trim()

      const newstr = page.content + new Date().toISOString()
      const hashstr = ["-", shortHash(newstr).toLowerCase()].join("")

      const slugTitle = await zhSlugify(title)
      const pinyinTitle = pinyinSlugify(title)
      const pinyinInitialsTitle = getFirstLetters(pinyinTitle)

      const slug = slugTitle + hashstr
      const pinyin = pinyinTitle + hashstr
      const pinyinInitials = pinyinInitialsTitle + hashstr
      pluginInstance.logger.info("slug=>", slug)
      pluginInstance.logger.info("pinyin=>", pinyin)
      pluginInstance.logger.info("pinyinInitials=>", pinyinInitials)

      const attName = slug
      const attAlias = [pinyin, pinyinInitials].join()
      await this.doSaveAttrs(pluginInstance, attName, attAlias)
    } catch (e) {
      showMessage(`别名生成失败，可能是未打开文档！详细错误信息 => ${e.toString()}`, 7000, "error")
      flag = false
    }
    return flag
  }

  public static async doSaveAttrs(pluginInstance: SlugPlugin, attName: string, attAlias: string) {
    const pageId = PageUtil.getPageId()
    const customAttrs = {
      name: attName,
      alias: attAlias,
      "custom-slug": attName,
    }
    const data = await pluginInstance.kernelApi.setBlockAttrs(pageId, customAttrs)
    if (data.code !== 0) {
      showMessage(`属性获取失败 => ${data.msg}`, 7000, "error")
      return
    }
  }
}