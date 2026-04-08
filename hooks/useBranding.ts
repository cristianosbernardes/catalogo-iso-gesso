'use client'

import { useState, useEffect } from 'react'
import { apiClient, CDN_URL } from '@/lib/api'

const BUCKET = 'identidade-visual'
const LOGO_FOLDER = 'icone-logo'

const DEFAULTS = {
  logoSize: 40,
  appName: 'ISO-GESSO',
  appNameSize: 20,
  bgEnabled: false,
  bgColor: '#FFF100',
  textColor: '#404041',
}

interface BrandingConfig {
  logoSize: number
  appName: string
  appNameSize: number
  bgEnabled: boolean
  bgColor: string
  textColor: string
}

interface BrandingResult {
  logoUrl: string | null
  logoSize: number
  appName: string
  appNameSize: number
  bgEnabled: boolean
  bgColor: string
  textColor: string
  loading: boolean
  hasCustomLogo: boolean
}

interface StorageFile {
  key: string
  size: number
  url: string
}

export function useBranding(context: 'crm' | 'site' = 'crm'): BrandingResult {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [config, setConfig] = useState<BrandingConfig>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const prefix = context === 'crm' ? 'logo-crm' : 'logo-site'

  useEffect(() => {
    async function load() {
      try {
        const files = await apiClient<StorageFile[]>(
          `/api/storage/${BUCKET}/${LOGO_FOLDER}`,
          { params: { list: 'true' } }
        )
        const file = files?.find((f) => f.key.startsWith(prefix))
        if (file) {
          setLogoUrl(`${CDN_URL}/${BUCKET}/${LOGO_FOLDER}/${file.key}?t=${Date.now()}`)
        }

        const dbConfig = await apiClient<Record<string, any>>(`/api/branding/${context}`)

        if (dbConfig) {
          setConfig({
            logoSize: dbConfig.logoSize ?? dbConfig.logo_size ?? DEFAULTS.logoSize,
            appName: dbConfig.appName ?? dbConfig.app_name ?? DEFAULTS.appName,
            appNameSize: dbConfig.appNameSize ?? dbConfig.app_name_size ?? DEFAULTS.appNameSize,
            bgEnabled: dbConfig.bgEnabled ?? dbConfig.bg_enabled ?? DEFAULTS.bgEnabled,
            bgColor: dbConfig.bgColor ?? dbConfig.bg_color ?? DEFAULTS.bgColor,
            textColor: dbConfig.textColor ?? dbConfig.text_color ?? DEFAULTS.textColor,
          })
        }
      } catch { /* empty */ }
      setLoading(false)
    }
    load()
  }, [prefix, context])

  return {
    logoUrl,
    ...config,
    loading,
    hasCustomLogo: !!logoUrl,
  }
}
