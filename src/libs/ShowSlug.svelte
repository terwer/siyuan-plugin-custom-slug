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
  import SlugPlugin from "../index"
  import PageUtil from "../utils/pageUtil"
  import { showMessage } from "siyuan"
  import { AttrService } from "../service/attrService"

  export let pluginInstance: SlugPlugin
  export let dialog

  let attrs = {} as any
  let attName
  let attAlias

  const onSaveAttr = async () => {
    dialog.destroy()

    await AttrService.doSaveAttrs(pluginInstance, attName, attAlias)
    showMessage(`${pluginInstance.i18n.tipsAttrSaveOk}`, 2000, "info")
  }

  const onCancel = async () => {
    dialog.destroy()
  }

  onMount(async () => {
    const pageId = PageUtil.getPageId()
    const data = await pluginInstance.kernelApi.getBlockAttrs(pageId)
    if (data.code !== 0) {
      showMessage(`${pluginInstance.i18n.tipsAttrFetchError} => ${data.msg}`, 7000, "error")
      return
    }
    attrs = data.data
    attName = attrs?.name ?? ""
    attAlias = attrs?.alias ?? ""
    pluginInstance.logger.info("attrs", attrs)
  })
</script>

<div class="config__tab-container">
  <label class="fn__flex b3-label">
    <div class="fn__flex-1">
      {pluginInstance.i18n.name}
      <div class="b3-label__text">{pluginInstance.i18n.nameTips}</div>
      <div class="fn__hr" />
      <input
        class="b3-text-field fn__block"
        placeholder={pluginInstance.i18n.namePlaceholder}
        spellcheck="false"
        bind:value={attName}
      />
    </div>
  </label>

  <label class="fn__flex b3-label">
    <div class="fn__flex-1">
      {pluginInstance.i18n.alias}
      <div class="b3-label__text">
        {pluginInstance.i18n.aliasTips}
      </div>
      <div class="fn__hr" />
      <textarea
        class="b3-text-field fn__block"
        placeholder={pluginInstance.i18n.aliasPlaceholder}
        rows="4"
        spellcheck="false"
        bind:value={attAlias}
      />
    </div>
  </label>

  <div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" on:click={onCancel}>{pluginInstance.i18n.cancel}</button>
    <div class="fn__space" />
    <button class="b3-button b3-button--text" on:click={onSaveAttr}>{pluginInstance.i18n.save}</button>
  </div>
</div>
