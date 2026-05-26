'use client'

import { QRCodeSVG } from 'qrcode.react'

interface Props {
  value: string
  /** Size in pixels (default 180) */
  size?: number
  /** URL or path to the logo placed in the QR center */
  logoSrc?: string
}

export default function QRCodeDisplay({ value, size = 180, logoSrc = '/image/logo_mercedes.jpg' }: Props) {
  const logoSize = Math.round(size * 0.22)

  return (
    <div className="inline-block p-3 bg-white rounded-2xl shadow-inner leading-none">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#FFFFFF"
        fgColor="#09090B"
        level="H"
        imageSettings={{
          src: logoSrc,
          height: logoSize,
          width: logoSize,
          excavate: true,
        }}
      />
    </div>
  )
}
