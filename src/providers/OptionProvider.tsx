import { storage } from '#imports'
import {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  getOptions,
  mergeOptions,
  OPTIONS_STORAGE_KEY,
  LIME_DEFAULT_OPTIONS,
  setOptions,
  type LimeOptions,
} from '@/utils/options'
import { OptionContext, type OptionContextValue } from './OptionContext'

export function OptionProvider ({ children }: PropsWithChildren) {
  const [options, setOptionState] = useState<LimeOptions>(LIME_DEFAULT_OPTIONS)
  const [isLoading, setIsLoading] = useState(true)
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    let isMounted = true
    const unwatch = storage.watch<Partial<LimeOptions>>(OPTIONS_STORAGE_KEY, (newValue) => {
      if (!isMounted) {
        return
      }

      setOptionState(mergeOptions(newValue))
      setIsLoading(false)
    })

    void getOptions().then((loadedOptions) => {
      if (!isMounted) {
        return
      }

      setOptionState(loadedOptions)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      unwatch()
    }
  }, [])

  const updateOption: OptionContextValue['updateOption'] = async (key, value) => {
    const nextOptions = {
      ...optionsRef.current,
      [key]: value,
    }

    optionsRef.current = nextOptions
    setOptionState(nextOptions)
    await setOptions(nextOptions)
  }

  return (
    <OptionContext value={{ options, isLoading, updateOption }}>
      {children}
    </OptionContext>
  )
}
