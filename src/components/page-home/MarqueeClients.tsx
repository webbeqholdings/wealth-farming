import { cn } from '@/lib/utils'
import Marquee from '@/components/ui/marquee'
import Image from 'next/image'

const reviews = [
  {
    name: 'John',
    username: '@investor_john',
    body: 'Amazing service! My portfolio has grown so much since I started with this fund. Highly recommended!',
    img: 'https://avatar.vercel.sh/jack',
  },
  {
    name: 'Jill',
    username: '@finance_guru',
    body: 'Excellent investment advice and clear communication. My returns have been consistently strong!',
    img: 'https://avatar.vercel.sh/jill',
  },
  {
    name: 'Sophia',
    username: '@wealth_builder',
    body: 'This fund has been a game-changer for me. Their strategy really delivers!',
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: 'Emma',
    username: '@futureplanner',
    body: "I appreciate how transparent and reliable they are. I've never felt more secure about my investments!",
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: 'Sara',
    username: '@sara_savings',
    body: 'Customer service is fantastic, and they always answer my questions promptly. Great experience!',
    img: 'https://avatar.vercel.sh/jenny',
  },
  {
    name: 'James',
    username: '@james_invests',
    body: 'Trustworthy and professional. My finances are in good hands here!',
    img: 'https://avatar.vercel.sh/james',
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function MarqueeClients() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  )
}
