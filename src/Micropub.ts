import fetch from "isomorphic-unfetch"
import { MicropubConfig } from "./MicropubConfig"
import { URLSearchParams } from "url"
import { MicropubUpdate } from "./MicropubUpdate"

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

  async update(request: MicropubUpdate): Promise<any> {
    if (!request.replace && !request.add && !request.delete) {
      throw new Error(
        "At least one of 'replace', 'add', or 'delete' must be used when updating an entry"
      )
    }

    const requestBody = { action: "update", ...request }
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (e) {
      return text
    }
  }

  private get defaultHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
    }
  }
}
