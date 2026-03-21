import { storage } from '#imports'

export interface LimeOptions {
  pip: boolean
  screenshot: boolean
}

export const OPTIONS_STORAGE_KEY = 'local:options' as const

export const LIME_DEFAULT_OPTIONS: LimeOptions = {
  pip: true,
  screenshot: true,
}

export function mergeOptions (options?: Partial<LimeOptions> | null): LimeOptions {
  return {
    ...LIME_DEFAULT_OPTIONS,
    ...options,
  }
}

export async function getOptions (): Promise<LimeOptions> {
  const options = await storage.getItem<Partial<LimeOptions>>(OPTIONS_STORAGE_KEY)
  return mergeOptions(options)
}

export async function setOptions (options: Partial<LimeOptions>): Promise<void> {
  await storage.setItem<LimeOptions>(OPTIONS_STORAGE_KEY, mergeOptions(options))
}
