import { useEffect, useState } from 'react'

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const m = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    if (m.addEventListener) m.addEventListener('change', handler)
    else m.addListener(handler)
    setMatches(m.matches)
    return () => {
      if (m.removeEventListener) m.removeEventListener('change', handler)
      else m.removeListener(handler)
    }
  }, [query])

  return matches
}
