'use client'

import { useEffect } from 'react'
import { apiClient, CDN_URL } from '@/lib/api'

const BUCKET = 'identidade-visual'
const LOGO_FOLDER = 'icone-logo'

interface StorageFile {
  key: string
  size: number
  url: string
}

export function DynamicFavicon() {
  useEffect(() => {
    async function loadFavicon() {
      try {
        const files = await apiClient<StorageFile[]>(
          `/api/storage/${BUCKET}/${LOGO_FOLDER}`,
          { params: { list: 'true' } }
        )
        const favicon = files?.find((f) => f.key.startsWith('logo-site'))
        if (favicon) {
          const url = `${CDN_URL}/${BUCKET}/${LOGO_FOLDER}/${favicon.key}?t=${Date.now()}`

          // Remove existing favicons
          document.querySelectorAll('link[rel*="icon"]').forEach((el) => el.remove())

          // Add new favicon
          const link = document.createElement('link')
          link.rel = 'icon'
          link.href = url
          link.type = favicon.key.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
          document.head.appendChild(link)

          // Apple touch icon
          const apple = document.createElement('link')
          apple.rel = 'apple-touch-icon'
          apple.href = url
          document.head.appendChild(apple)
        }
      } catch {
        // Silently fail — keep default or no favicon
      }
    }
    loadFavicon()
  }, [])

  return null
}
