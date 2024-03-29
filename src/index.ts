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

import { App, getFrontend, IObject, Plugin, showMessage } from "siyuan"
import { initTopbar, showSettingMenu } from "./topbar"
import KernelApi from "./api/kernel-api"
import { simpleLogger } from "zhi-lib-base"
import { isDev } from "./Constants"

import "./index.styl"
import { createCancelableDebounce } from "./utils/utils"
import { AttrService } from "./service/attrService"
import { initStatusBar } from "./statusBar"
import { ConfigManager } from "./store/config"

/**
 * 别名插件
 *
 * @author terwer
 * @version 0.0.1
 * @since 0.0.1
 */
export default class SlugPlugin extends Plugin {
  public isMobile: boolean
  public logger
  public kernelApi: KernelApi
  private renameEvent: any
  public statusBarElement

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = simpleLogger("index", "custom-slug", isDev)
    this.kernelApi = new KernelApi()
  }

  async onload() {
    const frontEnd = getFrontend()
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile"

    await initTopbar(this)
    initStatusBar(this)
  }

  onLayoutReady() {
    const that = this
    const handleRenameEvent = createCancelableDebounce(async () => {
      // 读取配置
      const settingConfig = (await ConfigManager.loadConfig(that)) as any
      const autoSwitch = settingConfig?.auto ?? false
      if (!autoSwitch) {
        this.logger.warn("自动生成别名未开启")
        return
      }

      this.showLoading()
      const result = await AttrService.autoGenerateAttrs(this)
      if (!result) {
        this.showError()
        return
      }
      this.showSuccess()
    }, 2000)

    this.renameEvent = (e) => {
      // 不是 rename 事件，忽略，防止误触发
      if (!e || e.detail.cmd !== "rename") {
        return
      }

      handleRenameEvent()
    }
    this.eventBus.on("ws-main", this.renameEvent)
    this.logger.info("eventBus ws-main enabled")
  }

  onunload() {
    this.eventBus.off("ws-main", this.renameEvent)
    this.logger.info("eventBus ws-main destroyed")
  }

  openSetting() {
    showSettingMenu(this)
  }

  //================================================================
  // private function
  //================================================================
  public showLoading() {
    try {
      document.querySelector(".protyle:not(.fn__none) .protyle-title .protyle-attr").classList.add("loading")
      document.querySelector(".protyle:not(.fn__none) .protyle-title .protyle-attr.loading").innerHTML =
        this.i18n.tipsLoading
    } catch (e) {
      // showMessage(`${this.i18n.tipsLoadingError} => ${e.toString()}`, 2000, "error")
    }
  }

  public showError() {
    document.querySelector(".protyle:not(.fn__none) .protyle-title .protyle-attr.loading").innerHTML = ""
    document.querySelector(".protyle:not(.fn__none) .protyle-title .protyle-attr").classList.remove("loading")
    showMessage(`${this.i18n.tipsLoadingError}`, 2000, "error")
  }

  public showSuccess() {
    try {
      document.querySelector(".protyle:not(.fn__none) .protyle-title .protyle-attr").classList.remove("loading")
    } catch (e) {
      showMessage(`${this.i18n.tipsLoadingError} => ${e.toString()}`, 2000, "error")
    }
  }
}
