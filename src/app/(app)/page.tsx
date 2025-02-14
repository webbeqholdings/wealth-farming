'use client'
import FeaturesSection from '@/components/page-home/FeaturesSection'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MinimalHero } from '@/components/page-home/MinimalHero'
import { MarqueeAnnouncements } from '@/components/page-home/MarqueeAnnouncements'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Wallet, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CTASection } from '@/components/page-home/CTASection'
import { BreakingNewsCarousel } from '@/components/page-home/BreakingNews'
import ChatBot from "@/components/botpress/ChatBot"
export default function IndexPage() {
  const { t } = useTranslation();
  const announcements = [
    t('welcome_message'),
    t('new_opportunity'),
    t('webinar'),
    t('q2_report'),
    t('join_discord'),
  ]

  const steps = [
    {
      number: '1',
      title: t('create_account'),
      description: t('enter_code'),
      icon: Mail,
      buttonText: t('sign_up_now'),
      buttonHref: '/join',
    },
    {
      number: '2',
      title: t('make_deposit'),
      description: t('fund_account'),
      icon: Wallet,
      buttonText: t('deposit_now'),
      buttonHref: '/account/deposit',
    },
    {
      number: '3',
      title: t('start_investing'),
      description: t('start_journey'),
      icon: BarChart3,
      buttonText: t('trade_now'),
      buttonHref: 'investment-products/incoming/investment-process',
    },
  ]

  const faqs = [
    {
      question: t('beq_fund'),
      answer: t('beq_fund_info'),
    },
    {
      question: t('start_investing_question'),
      answer: t('start_investing_info'),
    },
    {
      question: t('investment_types'),
      answer: t('investment_types_info'),
    },
    {
      question: t('min_investment'),
      answer: t('min_investment_info'),
    },
    {
      question: t('returns'),
      answer: t('returns_info'),
    },
  ]

  return (
    <>
      <SiteHeader />
      <MinimalHero />
      <div className="container relative">
        <MarqueeAnnouncements
          items={announcements}
          speed={12}
          className="py-2 text-sm font-medium"
        />

        <div className="container mx-auto px-0 md:py-14">
          <CTASection />
        </div>

        <div className="container mx-auto px-0 md:py-14">
          <div className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {t('get_started')}
          </div>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {t('email_prompt')}
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="bg-background flex flex-col">
                <CardHeader className="pb-4">
                  <div className="bg-muted w-8 h-8 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-xl font-bold">{step.number}</span>
                  </div>
                  <step.icon className="w-16 h-16 mb-4 text-primary" />
                  <CardTitle className="text-xl font-bold">{t(step.title)}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{t(step.description)}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full font-bold" variant="secondary" asChild>
                    <a href={step.buttonHref}>{t(step.buttonText)}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-0 md:py-14">
          <div className="mt-10 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            <div className="text-xl font-semibold tracking-tight pb-1">
              {t('risk_warning')}
            </div>
            {t('wealth_farming_risk')}
          </div>
          <FeaturesSection />
        </div>
        <div>
          <ChatBot />
        </div>

        <div className="container mx-auto px-0 md:py-14">
          <h2 className="text-3xl font-bold mb-8">{t('faq')}</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{t(faq.question)}</AccordionTrigger>
                <AccordionContent>{t(faq.answer)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="container mx-auto px-0 md:py-14">
          <BreakingNewsCarousel />
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
