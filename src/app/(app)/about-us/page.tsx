'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const teamMembers = [
  { name: 'John Doe', role: 'CEO', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Jane Smith', role: 'CTO', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Mike Johnson', role: 'Lead Designer', image: '/placeholder.svg?height=100&width=100' },
  {
    name: 'Sarah Brown',
    role: 'Marketing Director',
    image: '/placeholder.svg?height=100&width=100',
  },
]

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 lg:py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About Our Company</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            We are on a mission to revolutionize the industry with innovative solutions.
          </p>
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt="Company team"
            width={800}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>What drives us every day</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                At our core, we believe in harnessing the power of technology to solve real-world
                problems. Our mission is to create innovative solutions that improve peoples lives
                and push the boundaries of whats possible. We re committed to sustainability,
                ethical practices, and fostering a culture of continuous learning and growth.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We constantly push the boundaries of what possible, embracing new ideas and
                  technologies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We uphold the highest ethical standards in all our interactions and decisions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in the power of teamwork and fostering a supportive, inclusive
                  environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            We always looking for talented individuals to join our team.
          </p>
          <Button asChild size="lg">
            <Link href="/careers">View Open Positions</Link>
          </Button>
        </section>
      </div>
      <SiteFooter />
    </>
  )
}
