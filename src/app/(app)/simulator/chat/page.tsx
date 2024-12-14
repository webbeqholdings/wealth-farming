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
import { CheckCircle, Users, DollarSign, ArrowRight, Trophy } from 'lucide-react'
import { ChatButton } from '@/components/chat/ChatButton'

// Mock data for the ranking table
const topReferrers = [
  { rank: 1, username: 'J***n', referrals: 25, rewards: '$2,500' },
  { rank: 2, username: 'S***h', referrals: 22, rewards: '$2,200' },
  { rank: 3, username: 'M***e', referrals: 20, rewards: '$2,000' },
  { rank: 4, username: 'A***x', referrals: 18, rewards: '$1,800' },
  { rank: 5, username: 'L***a', referrals: 15, rewards: '$1,500' },
]

export default function DemoChat() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Demo Chat</h1>
      <p className='text-xl text-muted-foreground mb-8 text-center'>
        Invite your friends to BeQ Wealth Farming Fund and earn rewards!
      </p>

      <div className='grid gap-6 md:grid-cols-3 mb-12'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Users className='mr-2 h-6 w-6' />
              Invite Friends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Share your unique referral link with friends and family interested in smart investing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <CheckCircle className='mr-2 h-6 w-6' />
              They Join
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              When your friends sign up and make their first investment, you both qualify for
              rewards.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <DollarSign className='mr-2 h-6 w-6' />
              Earn Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Receive a bonus on your next investment and ongoing benefits for each successful
              referral.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className='mb-12'>
        <CardHeader>
          <CardTitle>Referral Program Benefits</CardTitle>

          <CardDescription>Here what you and your friends can earn</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='list-disc pl-6 space-y-2'>
            <li>5% bonus on your next investment for each successful referral</li>
            <li>Your friends get a 2% bonus on their first investment</li>
            <li>Earn 0.5% of your referrals is investment profits for the first year</li>
            <li>Unlock exclusive investment opportunities after 5 successful referrals</li>
          </ul>
        </CardContent>
      </Card>

      <Card className='mb-12'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Trophy className='mr-2 h-6 w-6' />
            Top Referrers
          </CardTitle>
          <CardDescription>See how you stack up against our top performers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Rewards Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topReferrers.map((referrer) => (
                <TableRow key={referrer.rank}>
                  <TableCell className='font-medium'>{referrer.rank}</TableCell>
                  <TableCell>{referrer.username}</TableCell>
                  <TableCell>{referrer.referrals}</TableCell>
                  <TableCell>{referrer.rewards}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className='bg-primary text-primary-foreground'>
        <CardHeader>
          <CardTitle>Ready to Start Referring?</CardTitle>
          <CardDescription className='text-primary-foreground/80'>
            Get your unique referral link and start earning rewards today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant='secondary' size='lg'>
            <Link href='/referrals/dashboard'>
              Go to Your Referral Dashboard
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <ChatButton />
    </div>
  )
}
