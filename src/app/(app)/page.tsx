import { CoverText } from '@/components/page-home/CoverText'
import { MarqueeClients } from '@/components/page-home/MarqueeClients'
import Link from 'next/link'
import FeaturesSection from '@/components/page-home/FeaturesSection'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

import { MinimalHero } from '@/components/page-home/MinimalHero'
import { Metadata } from 'next'
import { MarqueeAnnouncements } from '@/components/page-home/MarqueeAnnouncements'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Wallet, BarChart3 } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CTASection } from '@/components/page-home/CTASection'
import { BreakingNewsCarousel } from '@/components/page-home/BreakingNews'
import CryptoDashboard from '@/components/crypto/CryptoDashboard'
import WorldIndicesDashboard from '@/components/crypto/WorldIndicesDashboard'

export const metadata: Metadata = {
  title: 'Wealth Farming | Cultivate wealth, harvest results',
  description: 'Example music app using the components.',
}

export default function IndexPage() {
  const announcements = [
    'Welcome to BeQ Wealth Farming Fund!',
    'New investment opportunity: Green Energy Farms',
    'Webinar: Sustainable Investing Strategies - Register Now',
    'Q2 Performance Report Now Available',
    'Join our Discord community for daily market insights',
  ]

  const steps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Simply enter the code on the verification page to complete your signup.',
      icon: Mail,
      buttonText: 'Sign Up Now',
      buttonHref: '/join',
    },
    {
      number: '2',
      title: 'Make Deposit',
      description: 'Fund your account easily on the BeQ Web or App.',
      icon: Wallet,
      buttonText: 'Deposit Now',
      buttonHref: '/account/deposit',
    },
    {
      number: '3',
      title: 'Start Investing',
      description: 'Kick off your journey with your favorite Spot pairs or Futures contracts!',
      icon: BarChart3,
      buttonText: 'Trade Now',
      buttonHref: 'investment-products/incoming/invesment-process',
    },
  ]

  const faqs = [
    {
      question: 'What is BeQ Wealth Farming Fund?',
      answer:
        'BeQ Wealth Farming Fund is an innovative investment platform that focuses on agricultural and sustainable farming projects. We combine traditional farming wisdom with cutting-edge technology to offer unique investment opportunities.',
    },
    {
      question: 'How do I start investing with BeQ?',
      answer:
        'To start investing with BeQ, you need to create an account, verify your identity, and make an initial deposit. Once your account is funded, you can browse available investment opportunities and allocate your funds according to your preferences.',
    },
    {
      question: 'What types of investments does BeQ offer?',
      answer:
        'BeQ offers a range of agricultural investments, including crop farming, livestock, sustainable agriculture technologies, and agri-tech startups. Our portfolio is diversified to balance risk and potential returns.',
    },
    {
      question: 'Is there a minimum investment amount?',
      answer:
        'Yes, the minimum investment amount varies depending on the specific opportunity. Generally, our entry-level investments start at $500, but some specialized projects may have higher minimums.',
    },
    {
      question: 'How are returns generated and distributed?',
      answer:
        'Returns are generated through the successful operation and harvest of our farming projects, as well as the appreciation of agri-tech investments. Profits are distributed to investors based on their stake in each project, typically on a quarterly or annual basis.',
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
            Get Started in 30 Seconds!
          </div>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Provide your email address and check your inbox for a 6-digit verification code.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="bg-background flex flex-col">
                <CardHeader className="pb-4">
                  <div className="bg-muted w-8 h-8 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-xl font-bold">{step.number}</span>
                  </div>
                  <step.icon className="w-16 h-16 mb-4 text-primary" />
                  <CardTitle className="text-xl font-bold">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full font-bold" variant="secondary" asChild>
                    <a href={step.buttonHref}>{step.buttonText}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-0 md:py-14">
          <div className="mt-10 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            <div className="text-xl font-semibold tracking-tight pb-1">
              All investing involves risk.
            </div>
            With Wealth Farming, that is not very risky.
          </div>
          <FeaturesSection />
        </div>

        <div className="container mx-auto px-0 md:py-14">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
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
