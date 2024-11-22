import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { CalendarIcon, ClockIcon, MessageCircle, ThumbsUp, Share2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

// This would typically come from your database or CMS
const article = {
  title: 'The Future of Artificial Intelligence: Promises and Perils',
  author: {
    name: 'Dr. Jane Smith',
    avatar: '/avatars/jane-smith.jpg',
    bio: 'AI researcher and professor at Tech University',
  },
  publishDate: new Date('2024-03-15'),
  readTime: 8,
  category: 'Technology',
  image: '/images/ai-future.jpg',
  content: `
    <p>Artificial Intelligence (AI) stands at the forefront of technological innovation, promising to revolutionize industries, enhance human capabilities, and solve complex global challenges. As we venture further into the AI era, it's crucial to examine both the immense potential and the significant risks this technology presents.</p>

    <h2>The Promise of AI</h2>
    <p>AI's potential to improve our lives is vast and multifaceted. In healthcare, AI algorithms are already assisting in early disease detection and drug discovery. The transportation sector is on the brink of a revolution with self-driving vehicles promising safer roads and more efficient travel. AI-powered personal assistants are becoming increasingly sophisticated, helping us manage our daily lives with unprecedented ease.</p>

    <h2>The Perils of Unchecked AI Development</h2>
    <p>However, the rapid advancement of AI also raises serious concerns. Issues of privacy and data security loom large as AI systems require vast amounts of personal data to function effectively. The potential for AI to automate many jobs raises questions about the future of work and economic inequality. Perhaps most concerning are the ethical implications of creating machines that can make decisions affecting human lives.</p>

    <h2>Striking a Balance</h2>
    <p>As we move forward, it's clear that the development of AI must be guided by strong ethical principles and robust regulatory frameworks. We must strive to harness the benefits of AI while mitigating its risks, ensuring that this powerful technology serves the collective good of humanity.</p>

    <p>The future of AI is not predetermined. It will be shaped by the choices we make today in research, policy, and application. By fostering an informed and inclusive dialogue about AI's role in our society, we can work towards a future where AI enhances human potential rather than diminishing it.</p>
  `,
  tags: ['Artificial Intelligence', 'Technology', 'Ethics', 'Future'],
  comments: [
    {
      author: 'TechEnthusiast',
      content:
        "Fascinating article! I'm particularly interested in how AI will shape the job market in the coming years.",
      timestamp: new Date('2024-03-15T10:30:00'),
    },
    {
      author: 'EthicsFirst',
      content:
        'Great points on the ethical considerations. We need more discussion on AI governance.',
      timestamp: new Date('2024-03-15T11:45:00'),
    },
  ],
  relatedArticles: [
    { title: '5 Ways AI is Transforming Healthcare', slug: 'ai-in-healthcare' },
    { title: 'The Ethics of Autonomous Vehicles', slug: 'autonomous-vehicle-ethics' },
    { title: 'AI and Privacy: Navigating the Data Dilemma', slug: 'ai-privacy-concerns' },
  ],
}

export default function NewsDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <span className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(article.publishDate, 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4" />
              {article.readTime} min read
            </span>
            <Badge variant="secondary">{article.category}</Badge>
          </div>
        </header>

        <Image
          src={article.image}
          alt="AI Future"
          width={1200}
          height={630}
          className="rounded-lg mb-8"
        />

        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">About the Author</h2>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback>
                {article.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{article.author.name}</h3>
              <p className="text-muted-foreground">{article.author.bio}</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {article.relatedArticles.map((related, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{related.title}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Link href={`/news/${related.slug}`} className="text-primary hover:underline">
                    Read more
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <div className="space-y-4 mb-6">
            {article.comments.map((comment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{comment.author}</CardTitle>
                  <CardDescription>{format(comment.timestamp, 'PPp')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Leave a Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <Textarea placeholder="Type your comment here." className="mb-4" />
                <Button>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Post Comment
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </article>
    </div>
  )
}
