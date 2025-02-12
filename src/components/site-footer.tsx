'use client'
import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import userStatus from '@/lib/userStatus'
import { useRouter } from 'next/navigation'
import { updateUserSubscription } from "@/lib/users"
import { useToast } from '@/hooks/use-toast'

export function SiteFooter() {
  const { t } = useTranslation()
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { isLoggedIn, user } = userStatus()
  const router = useRouter()
  const { toast } = useToast()

  async function updateSubscription(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/join')
      return
    }
    const formData = new FormData(e.currentTarget);
    const email = formData.get("user_email");

    if (email == user.email) {
      updateUserSubscription(user.id);
      toast({
        title: 'Success',
        description: 'You have successfully updated your subscription preferences.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Email does not match the user email.',
      });
    }
  }

  return (
    <footer className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      {/* Full-width background section */}
      <div className="w-full md:py-12 bg-secondary/10">
        {/* Centered inner content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wealth Farming</h3>
            <p className="text-sm text-muted-foreground">{t('grow_your_wealth')}</p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/p/BeQ-Holdings-61555802044845/"
                target="_blank"
                rel="noreferrer"
              >
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
                <Link
                  href={`/explore-tools/economic-calendar?locale=${locale}`}
                  className="hover:underline"
                >
                  {t('econ_calendar')}
                </Link>
              </li>
              <li>
                <Link
                  href="/investment-products/incoming/investment-process"
                  className="hover:underline"
                >
                  {t('dynamic_cal')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/explore-tools/compound-interest-rate?locale=${locale}`}
                  className="hover:underline"
                >
                  {t('invest_sim')}
                </Link>
              </li>
              <li>
                <Link href="/referral" className="hover:underline">
                  {t('referral_program')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{t('newsletter')}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t('stay_updated')}
            </p>
            <form className="flex space-x-2" onSubmit={updateSubscription}>
              <Input
                type="email"
                name="user_email"
                placeholder= {t(`enter_email`)}
                className="max-w-[180px]"
              />
              <Button type="submit" variant="default">
                {t('subcribe')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer bottom section */}
      <div className="w-full py-4 text-center bg-secondary/10 border-t">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wealth Farming. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}