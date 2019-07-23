import fetch from "isomorphic-unfetch"
import { MicropubConfig } from "./MicropubConfig"
import { URLSearchParams } from "url"

export interface MicropubOptions {
  url: string
  token: string
}

export class Micropub {
  private url: string
  private token: string

  constructor(options: MicropubOptions) {
    this.url = options.url
    this.token = options.token
  }

  async getConfig(): Promise<MicropubConfig> {
    const params = new URLSearchParams({ q: "config" })
    const response = await fetch(`${this.url}?${params.toString()}`, {
      headers: this.defaultHeaders,
    })
    const body = await response.json()
    return body as MicropubConfig
  }

  private get defaultHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
    }
  }
}
