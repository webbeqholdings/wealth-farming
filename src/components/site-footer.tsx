'use client'
import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import userStatus from '@/lib/userStatus'
import { useRouter } from 'next/navigation'
import { updateUserSubscription } from "@/lib/mail"
import { useToast } from '@/hooks/use-toast'

export function SiteFooter() {
  const { t } = useTranslation()
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { isLoggedIn, user } = userStatus()
  const router = useRouter()
  const { toast } = useToast()

  async function userSubcription(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/join')
      return
    }
    const formData = new FormData(e.currentTarget);
    const email = formData.get("user_email");

    if (email == user.email){
      updateUserSubscription(user.id)
      toast({
        title: 'Success',
        description: 'Subscription updated successfully!',
      })
    }
  }

  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Changed grid-cols-4 to grid-cols-3 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wealth Farming</h3>
            <p className="text-sm text-muted-foreground">{t('grow_your_wealth')}</p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/p/BeQ-Holdings-61555802044845/" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{t('quick_link')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/explore-tools/economic-calendar`} className="hover:underline">
                Economic Calendar
                </Link>
              </li>
              <li>
                <Link href="/investment-products/incoming/investment-process" className="hover:underline">
                  {t('dynamic_cal')}
                </Link>
              </li>
              <li>
                <Link href={`/explore-tools/compound-interest-rate`} className="hover:underline">
                  Investment Simulator
                </Link>
              </li>
              <li>
                <Link href="/referral" className="hover:underline">
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{t('newsletter')}</h4>
            <p className="text-sm text-muted-foreground mb-4">{t('stay_updated')}</p>
            <form className="flex space-x-2" onSubmit={userSubcription}>
              <Input type="email" name='user_email' placeholder='Enter your email' className="max-w-[180px]" />
              <Button type="submit" variant="default">
                Subcribe
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wealth Farming. All rights reserved.
        </p>
      </div>
    </footer>
  )
}