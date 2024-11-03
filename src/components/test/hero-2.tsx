import Link from 'next/link'
import { Announcement } from '../announcement'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '../page-header'
import { Button } from '../ui/button'

const Hero2 = () => {
  return (
    <PageHeader>
      <Announcement />
      <PageHeaderHeading>Make smarter decisions with Wealth Farming</PageHeaderHeading>
      <PageHeaderDescription>
        Whether you are exploring stocks, IRAs, or crypto, our unbiased reviews and comparisons
        guide you in making informed choices for your next investment accounts.
      </PageHeaderDescription>
      <PageActions>
        <Button asChild size="sm">
          <Link href="/login">Get Started</Link>
        </Button>
      </PageActions>
    </PageHeader>
  )
}
export default Hero2
