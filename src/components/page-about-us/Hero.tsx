import Link from 'next/link'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header'
import { Button } from '../ui/button'

const HeroAboutUs = () => {
  return (
    <PageHeader>
      <PageHeaderHeading>About Us</PageHeaderHeading>
      <PageHeaderDescription>
        Dashboard, cards, authentication. Some examples built using the components. Use this as a
        guide to build your own.
      </PageHeaderDescription>
      <PageActions>
        <Button asChild size="sm">
          <Link href="/join">Create Account</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/book-schedule">Book Schedule</Link>
        </Button>
      </PageActions>
    </PageHeader>
  )
}
export default HeroAboutUs
