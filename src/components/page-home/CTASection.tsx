import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslation } from 'react-i18next';

export function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">{t('Embark on Your Wealth Journey Today!')}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {t('Join BeQ Wealth Farming Fund and start growing your investments with sustainable, innovative agricultural projects.')}
        </p>
        <Button size="lg" className="font-semibold text-lg px-8" asChild>
          <Link href="/investment-products/incoming/investment-process">{t('How it works')}</Link>
        </Button>
      </div>
    </section>
  )
}
