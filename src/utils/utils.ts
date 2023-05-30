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

import { slugify } from "transliteration"

/**
 * 中文翻译成英文别名
 * @param q 中文名
 * @returns {Promise<unknown>}
 */
export const zhSlugify = async (q: string): Promise<string> => {
  // const v = await fetch('https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=en-US&q=' + q);
  const v = await fetch("https://api.terwer.space/api/translate?q=" + q)
  const json = await v.json()
  let res = json[0][0]
  res = res.replaceAll(/-/g, "")
  res = res.replaceAll(/\./g, "")
  res = res.replaceAll(/~/g, "")

  res = slugify(res)

  res = res.replaceAll(/@/g, "")

  return res
}

/**
 * 拼音转别名
 *
 * @param q 中文名
 */
export const pinyinSlugify = (q: string): string => slugify(q)

/**
 * 根据拼音南湖区哦首字母
 *
 * @param pinyin
 */
export const getFirstLetters = (pinyin: string) => {
  let firstLetters = ""
  const pinyinArr = pinyin.split("-")
  pinyinArr.forEach((item) => {
    firstLetters += item[0]
  })
  return firstLetters
}

/**
 * 移除标题数字
 * @param str
 */
export const removeTitleNumber = (str: string): string => {
  let newstr = str

  // 移除序号
  const publisherRegex = /([0-9]*)\./
  newstr = newstr.replace(publisherRegex, "")

  return newstr
}
