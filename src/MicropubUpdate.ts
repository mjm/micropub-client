export interface MicropubUpdate {
  url: string
  replace?: Record<string, any[]>
  add?: Record<string, any[]>
  delete?: any[] | Record<string, any[]>
}
