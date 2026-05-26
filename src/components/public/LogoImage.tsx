'use client'

export default function LogoImage() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/image/logo_mercedes.jpg"
      alt="Mercedes-Benz"
      className="w-28 h-28 object-contain"
      onError={(e) => {
        const el = e.currentTarget
        el.style.display = 'none'
        const p = el.parentElement
        if (p) p.innerHTML = '<span class="font-bold text-steel-950 text-sm">MB</span>'
      }}
    />
  )
}
