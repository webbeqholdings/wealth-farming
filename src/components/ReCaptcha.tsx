'use client'

import { consolidateHTMLConverters } from '@payloadcms/richtext-lexical'
import { useEffect, useRef } from 'react'

interface ReCaptchaProps {
  sitekey: string
  onChange: (token: string | null) => void
}

declare global {
  interface Window {
    grecaptcha: any
    onReCaptchaLoad: () => void
  }
}

export function ReCaptcha({ sitekey, onChange }: ReCaptchaProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=onReCaptchaLoad`
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    window.onReCaptchaLoad = () => {
      if (ref.current) {
        window.grecaptcha.render(ref.current, {
          sitekey,
          callback: onChange,
        })
      }
    }

    return () => {
      document.body.removeChild(script)
      delete window.onReCaptchaLoad
    }
  }, [sitekey, onChange])

  return <div ref={ref} />
}
