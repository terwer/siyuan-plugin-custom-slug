import { Plugin } from "siyuan"
import "./index.styl"

export default class SamplePlugin extends Plugin {
  private customTab: () => any

  async onload() {}

  onLayoutReady() {}

  onunload() {}

  private blockIconEvent({ detail }: any) {
    console.log(detail)
    detail.menu.addSeparator(0)
    const ids: string[] = []
    detail.blockElements.forEach((item: HTMLElement) => {
      ids.push(item.getAttribute("data-node-id"))
    })
    detail.menu.addItem({
      index: 1,
      iconHTML: "",
      type: "readonly",
      label: "IDs<br>" + ids.join("<br>"),
    })
  }

  openSetting(): void {}
}
