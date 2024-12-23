import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Rocket, Target, Zap, Scale, Crosshair, Phone } from 'lucide-react'

const products = [
  { name: 'Nova Blaster', payload: 50, range: 500 },
  { name: 'Stellar Striker', payload: 100, range: 1000 },
  { name: 'Galactic Guardian', payload: 200, range: 2000 },
  { name: 'Cosmic Devastator', payload: 500, range: 5000 },
  { name: 'Nebula Annihilator', payload: 1000, range: 10000 },
]

export default function RocketLauncherLandingPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
                <Target className="mr-2" />
                Dominate the Cosmos with Our Rocket Launchers
              </h2>
              <p className="text-xl mb-8">
                Choose from our range of advanced rocket launchers for all your space warfare needs
              </p>
              <Button size="lg">
                <Zap className="mr-2" />
                Explore Our Arsenal
              </Button>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
                <Rocket className="mr-2" />
                Our Rocket Launcher Arsenal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Card key={product.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Rocket className="mr-2" />
                        {product.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold flex items-center">
                        <Scale className="mr-2" />
                        {product.payload} kg Payload
                      </p>
                      <p className="flex items-center">
                        <Crosshair className="mr-2" />
                        {product.range} km Range
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Zap className="mr-2" />
                        Order Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
                <Target className="mr-2" />
                Compare Our Rocket Launchers
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Launcher Name</TableHead>
                      <TableHead>Payload Capacity</TableHead>
                      <TableHead>Effective Range</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="flex items-center">
                          <Rocket className="mr-2" />
                          {product.name}
                        </TableCell>
                        <TableCell className="flex items-center">
                          <Scale className="mr-2" />
                          {product.payload} kg
                        </TableCell>
                        <TableCell className="flex items-center">
                          <Crosshair className="mr-2" />
                          {product.range} km
                        </TableCell>
                        <TableCell>
                          <Button variant="outline">
                            <Zap className="mr-2" />
                            Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <Rocket className="mr-2" />
                Ready to Arm Your Galactic Fleet?
              </h2>
              <p className="text-xl mb-8">
                Our weapons specialists are standing by to assist you in choosing the perfect rocket
                launcher
              </p>
              <Button size="lg">
                <Phone className="mr-2" />
                Schedule a Consultation
              </Button>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
