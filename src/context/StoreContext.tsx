import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getStoreSettings } from '../services/settings'
import type { StoreSettings } from '../types/store'

interface StoreContextType {
  settings: StoreSettings | null
  loading: boolean
  refreshSettings: () => Promise<void>
}

const StoreContext = createContext<StoreContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
})

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const data = await getStoreSettings()
      setSettings(data)
    } catch (err) {
      console.error('Failed to load store settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (settings?.store_name) {
      document.title = settings.store_name
    } else {
      document.title = 'Mi Tienda'
    }
  }, [settings])

  return (
    <StoreContext.Provider
      value={{ settings, loading, refreshSettings: fetchSettings }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
