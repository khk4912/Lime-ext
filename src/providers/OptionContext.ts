import { createContext } from 'react'
import type { LimeOptions } from '@/utils/options'

export type OptionContextValue = {
  options: LimeOptions
  isLoading: boolean
  updateOption: <K extends keyof LimeOptions>(key: K, value: LimeOptions[K]) => Promise<void>
}

export const OptionContext = createContext<OptionContextValue | null>(null)
