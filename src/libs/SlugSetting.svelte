<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->
<script lang="ts">
  import { onMount } from "svelte"
  import { ConfigManager } from "../store/config"
  import { showMessage } from "siyuan"

  export let pluginInstance
  export let dialog

  let nameSwitch
  let clearName
  let removePinyinSplit
  let settingConfig = {} as any

  const onSaveSetting = async () => {
    dialog.destroy()

    settingConfig.nameSwitch = nameSwitch
    settingConfig.clearName = clearName
    settingConfig.removePinyinSplit = removePinyinSplit
    await ConfigManager.saveConfig(pluginInstance, settingConfig)
    pluginInstance.logger.debug("saved setting config =>", settingConfig)
    showMessage(`${pluginInstance.i18n.settingConfigSaveSuccess}`, 2000, "info")
  }

  const onCancel = async () => {
    dialog.destroy()
  }

  onMount(async () => {
    settingConfig = await ConfigManager.loadConfig(pluginInstance)
    pluginInstance.logger.debug("loaded setting config =>", settingConfig)
    nameSwitch = settingConfig?.nameSwitch ?? false
    clearName = settingConfig?.clearName ?? false
    removePinyinSplit = settingConfig?.removePinyinSplit ?? false
  })
</script>

<div>
  <div class="config__tab-container">
    <label class="fn__flex b3-label">
      <div class="fn__flex-1">
        {pluginInstance.i18n.nameSwitch}
        <div class="b3-label__text">{pluginInstance.i18n.nameSwitchTips}</div>
      </div>
      <span class="fn__space" />
      <input id="nameSwitch" class="b3-switch fn__flex-center" type="checkbox" bind:checked={nameSwitch} />
    </label>

    <label class="fn__flex b3-label">
      <div class="fn__flex-1">
        {pluginInstance.i18n.clearName}
        <div class="b3-label__text">{pluginInstance.i18n.clearNameTips}</div>
      </div>
      <span class="fn__space" />
      <input id="clearName" class="b3-switch fn__flex-center" type="checkbox" bind:checked={clearName} />
    </label>

    <label class="fn__flex b3-label">
      <div class="fn__flex-1">
        {pluginInstance.i18n.removePinyinSplitSwitch}
        <div class="b3-label__text">{pluginInstance.i18n.removePinyinSplitSwitchTips}</div>
      </div>
      <span class="fn__space" />
      <input
        id="removePinyinSplit"
        class="b3-switch fn__flex-center"
        type="checkbox"
        bind:checked={removePinyinSplit}
      />
    </label>

    <div class="b3-dialog__action">
      <button class="b3-button b3-button--cancel" on:click={onCancel}>{pluginInstance.i18n.cancel}</button>
      <div class="fn__space" />
      <button class="b3-button b3-button--text" on:click={onSaveSetting}>{pluginInstance.i18n.save}</button>
    </div>
  </div>
</div>
