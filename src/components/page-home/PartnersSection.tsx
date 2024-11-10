import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const partners = [
  { name: 'Company A', logo: '/placeholder.svg?height=80&width=240' },
  { name: 'Company B', logo: '/placeholder.svg?height=80&width=240' },
  { name: 'Company C', logo: '/placeholder.svg?height=80&width=240' },
  { name: 'Company D', logo: '/placeholder.svg?height=80&width=240' },
  { name: 'Company E', logo: '/placeholder.svg?height=80&width=240' },
  { name: 'Company F', logo: '/placeholder.svg?height=80&width=240' },
]

export function PartnersSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          Our Trusted Partners
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 flex items-center justify-center h-24">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={120}
                  height={40}
                  className="max-w-full max-h-full object-contain"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
