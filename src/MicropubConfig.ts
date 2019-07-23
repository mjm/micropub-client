export interface MicropubConfig {
  "media-endpoint"?: string
  "post-types"?: MicropubPostType[]
}

export interface MicropubPostType {
  name: string
  type: string
}
