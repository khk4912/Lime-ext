const WINDOWS_RESERVED = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i

export const sanitizeFileName = (name: string): string => {
  // eslint-disable-next-line no-control-regex
  let sanitized = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')

  sanitized = sanitized.trim()
  sanitized = sanitized.replace(/[. ]+$/g, '')

  if (!sanitized) {
    sanitized = 'untitled'
  }

  if (WINDOWS_RESERVED.test(sanitized)) {
    sanitized = '_' + sanitized
  }

  const MAX_LEN = 250

  if (sanitized.length > MAX_LEN) {
    const match = sanitized.match(/(\.[^.]*)$/)
    if (match && match.index !== undefined && match.index > 0) {
      const ext = match[1]
      const base = sanitized.slice(0, MAX_LEN - ext.length)
      sanitized = base + ext
    } else {
      sanitized = sanitized.slice(0, MAX_LEN)
    }
  }

  return sanitized
}

export const ymdhms = (date: Date): string => {
  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${yy}${mm}${dd}${hh}${mi}${ss}`
}
