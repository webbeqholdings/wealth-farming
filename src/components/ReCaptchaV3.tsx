'use client'

import { useEffect, FC } from 'react'

interface ReCaptchaV3Props {
  sitekey: string
}

type GreCaptcha = {
  ready: (callback: () => void) => void
  execute: (sitekey: string, options: { action: string }) => Promise<string>
  render: (
    container: string | HTMLElement,
    options: { sitekey: string; [key: string]: any },
  ) => number
} & {
  [key: string]: any
}

declare global {
  interface Window {
    // @ts-ignore
    grecaptcha: GreCaptcha
  }
}

export const ReCaptchaV3: FC<ReCaptchaV3Props> = ({ sitekey }) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${sitekey}`
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [sitekey])

  return null
}

export async function executeRecaptcha(sitekey: string, action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('reCAPTCHA can only be executed in the browser')
      return
    }

    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(sitekey, { action })
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  })
}
