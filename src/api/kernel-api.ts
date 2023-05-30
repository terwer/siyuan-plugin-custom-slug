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

import { BaseApi, SiyuanData } from "./base-api"

/**
 * 思源笔记服务端API v2.8.9
 *
 * @see {@link https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md API}
 *
 * @author terwer
 * @version 0.0.1
 * @since 0.0.1
 */
class KernelApi extends BaseApi {
  /**
   * 获取块属性
   */
  public async getBlockAttrs(blockId: string): Promise<SiyuanData> {
    return await this.siyuanRequest("/api/attr/getBlockAttrs", {
      id: blockId,
    })
  }

  /**
   * 设置块属性
   */
  public async setBlockAttrs(blockId: string, attrs: any): Promise<SiyuanData> {
    return await this.siyuanRequest("/api/attr/setBlockAttrs", {
      id: blockId,
      attrs: attrs,
    })
  }

  /**
   * 以id获取思源块信息
   * @param blockId 块ID
   */
  public async getBlockByID(blockId: string): Promise<SiyuanData> {
    const stmt = `select *
                from blocks
                where id = '${blockId}'`
    return await this.sql(stmt)
  }

  /**
   * 以sql发送请求
   * @param sql sql
   */
  public async sql(sql: string): Promise<SiyuanData> {
    const sqldata = {
      stmt: sql,
    }
    const url = "/api/query/sql"
    return await this.siyuanRequest(url, sqldata)
  }
}

export default KernelApi
