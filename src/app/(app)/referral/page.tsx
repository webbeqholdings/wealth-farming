'use client'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle, Users, DollarSign, ArrowRight, Trophy, Network } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getReferralConfigRates } from '@/lib/investment-products/dynamicFundQuery'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getTotalNumberReferral } from '@/lib/referrals'

export default function ReferralsIntroductionPage() {

  const [configs, setConfigs] = useState([])
  const [top_referral, setTopReferral] = useState([])
  const { t } = useTranslation();

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await getReferralConfigRates()
      setConfigs(config)
    }
    const fetchTopReferral = async () => {
      const data = await getTotalNumberReferral()
      setTopReferral(data)
    }
    fetchTopReferral()
    fetchConfig()
  }, [])

  //Load top referral
  //** */
  useEffect(() => {
    const fetchTopReferral = async () => {
      const top_referral = (await getTotalNumberReferral());
      const reformat_top_referral = await Promise.all(
        top_referral.map(async (data: {
          parent: {
            id: number;
            first_name: string;
            last_name: string;
          }, count: number, balance: number
        }, index: number) => ({
          rank: index + 1,
          username: `${data.parent.first_name} ${data.parent.last_name}`,
          referrals: data.count,
          rewards: `$${data.balance.toLocaleString()}`
        }))
      );
      setTopReferral(reformat_top_referral)
    }
    fetchTopReferral()
  }, [])

  return (
    <div>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">{t('grow_wealth')}</h1>
        <p className="text-xl text-muted-foreground mb-8 text-center">
          {t('invite_friends_description')}
        </p>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6" />
                {t('invite_friends')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('share_referral_link2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-6 w-6" />
                {t('they_join')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('friends_sign_up')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-6 w-6" />
                {t('earn_rewards')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('receive_bonus')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>{t('referral_benefits')}</CardTitle>

            <CardDescription>{t('earn_with_friends')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('five_percent_bonus')}</li>
              <li>{t('friends_get_bonus')}</li>
              <li>{t('earn_percent_from_referrals')}</li>
              <li>{t('unlock_opportunities')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-6 w-6" />
              {t('top_referrers')}
            </CardTitle>
            <CardDescription>{t('compare_performers')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{t('rank')}</TableHead>
                  <TableHead>{t('user')}</TableHead>
                  <TableHead>{t('referrals')}</TableHead>
                  <TableHead>{t('rewards')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top_referral && top_referral.map((referrer: any) => (
                  <TableRow key={referrer.rank}>
                    <TableCell className="font-medium">{referrer.rank}</TableCell>
                    <TableCell>{referrer.username}</TableCell>
                    <TableCell>{referrer.referrals}</TableCell>
                    <TableCell>{referrer.rewards}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="mr-2 h-6 w-6" />
              {t('referral_levels')}
            </CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{t('name')}</TableHead>
                  <TableHead>{t('min')}</TableHead>
                  <TableHead>{t('max')}</TableHead>
                  <TableHead>{t('rate')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.name}>
                    <TableCell className="font-medium">{config.name}</TableCell>
                    <TableCell>{config.min}</TableCell>
                    <TableCell>{config.max}</TableCell>
                    <TableCell>{config.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>{t('ready_to_refer')}</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {t('get_referral_link')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" size="lg">
              <Link href="/account/referral">
                {t('go_to_dashboard')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </div>
  )
}
