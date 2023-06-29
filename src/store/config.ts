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

import SlugPlugin from "../index"

/**
 * 配置管理类
 * 提供配置的加载、保存和删除功能
 */
export class ConfigManager {
  private static storageKey = "slug-setting.json"

  /**
   * 加载配置
   *
   * @param pluginInstance SlugPlugin的实例
   * @returns 返回配置对象
   */
  public static async loadConfig(pluginInstance: SlugPlugin): Promise<object> {
    const configStr = await pluginInstance.loadData(this.storageKey)
    if (typeof configStr === "object") {
      return configStr
    }
    let config
    try {
      config = JSON.parse(configStr)
    } catch (e) {
      config = {}
    }
    return config
  }

  /**
   * 保存配置
   *
   * @param pluginInstance SlugPlugin的实例
   * @param config 配置对象
   */
  public static async saveConfig(pluginInstance: SlugPlugin, config: object): Promise<void> {
    const configJson = JSON.stringify(config)
    await pluginInstance.saveData(this.storageKey, configJson)
  }

  /**
   * 删除配置
   *
   * @param pluginInstance SlugPlugin的实例
   */
  public static async removeConfig(pluginInstance: SlugPlugin): Promise<void> {
    await pluginInstance.removeData(this.storageKey)
  }
}
