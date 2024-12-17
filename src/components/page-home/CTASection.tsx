import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Embark on Your Wealth Journey Today!</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join BeQ Wealth Farming Fund and start growing your investments with sustainable,
          innovative agricultural projects.
        </p>
        <Button size="lg" className="font-semibold text-lg px-8" asChild>
          <Link href="/join">Join Now</Link>
        </Button>
      </div>
    </section>
  )
}
