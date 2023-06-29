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
import debounce from "lodash.debounce"

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

/**
 * 封装可取消的防抖函数
 *
 * @param {Function} fn - 需要执行的函数
 * @param {number} wait - 等待时间
 * @returns {Function} - 可取消的防抖函数
 */
export const createCancelableDebounce = (fn, wait = 500) => {
  let task = null

  const debouncedFn = debounce((...args) => {
    const newTaskPromise = new Promise(async (resolve, reject) => {
      try {
        const result = await fn(...args)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })

    task = newTaskPromise
    return newTaskPromise
  }, wait)

  const cancelableDebounceFn = (...args) => {
    if (task) {
      debouncedFn.cancel() // 取消任务
    }

    return debouncedFn(...args)
  }

  return cancelableDebounceFn
}

export const generateCurrentTime = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JavaScript 的月份从 0 开始
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  // 使用 `padStart` 方法确保每个部分都有两位数字
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}${String(hours).padStart(
    2,
    "0"
  )}${String(minutes).padStart(2, "0")}${String(seconds).padStart(2, "0")}`
}
