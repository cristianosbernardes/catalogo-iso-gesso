'use client'

import { useEffect } from 'react'
import { apiClient } from '@/lib/api'

interface BrandingFavicon {
  faviconUrl: string | null
  faviconBgEnabled: boolean
  faviconBgColor: string
}

function applyFavicon(href: string, isSvg: boolean) {
  document.querySelectorAll('link[rel*="icon"]').forEach((el) => el.remove())

  const link = document.createElement('link')
  link.rel = 'icon'
  link.href = href
  link.type = isSvg ? 'image/svg+xml' : 'image/png'
  document.head.appendChild(link)

  const apple = document.createElement('link')
  apple.rel = 'apple-touch-icon'
  apple.href = href
  document.head.appendChild(apple)
}

async function compositeOnBackground(imageUrl: string, bgColor: string): Promise<string> {
  // Fetch as blob to avoid canvas taint issues with cross-origin images (including SVGs)
  const res = await fetch(imageUrl)
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size = 64
      const radius = 10
      const padding = 8
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!

      // Fundo com cantos arredondados
      ctx.beginPath()
      ctx.moveTo(radius, 0)
      ctx.lineTo(size - radius, 0)
      ctx.quadraticCurveTo(size, 0, size, radius)
      ctx.lineTo(size, size - radius)
      ctx.quadraticCurveTo(size, size, size - radius, size)
      ctx.lineTo(radius, size)
      ctx.quadraticCurveTo(0, size, 0, size - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
      ctx.closePath()
      ctx.fillStyle = bgColor
      ctx.fill()

      // Ícone com padding (margem interna)
      const iconSize = size - padding * 2
      ctx.drawImage(img, padding, padding, iconSize, iconSize)

      URL.revokeObjectURL(blobUrl)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl)
      reject(new Error('Failed to load favicon image'))
    }
    img.src = blobUrl
  })
}

export function DynamicFavicon() {
  useEffect(() => {
    async function loadFavicon() {
      try {
        const branding = await apiClient<BrandingFavicon>('/api/branding/favicon')

        if (!branding?.faviconUrl) return

        const url = `${branding.faviconUrl}?t=${Date.now()}`
        const isSvg = branding.faviconUrl.toLowerCase().endsWith('.svg')

        if (branding.faviconBgEnabled && branding.faviconBgColor) {
          const dataUrl = await compositeOnBackground(url, branding.faviconBgColor)
          applyFavicon(dataUrl, false)
        } else {
          applyFavicon(url, isSvg)
        }
      } catch {
        // Silently fail — keep default or no favicon
      }
    }
    loadFavicon()
  }, [])

  return null
}
