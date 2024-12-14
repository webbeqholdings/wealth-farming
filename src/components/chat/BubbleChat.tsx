'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I assist you today?',
    sender: 'agent',
    timestamp: new Date('2024-03-15T10:00:00'),
  },
  {
    id: '2',
    content: 'I have a question about my investment portfolio.',
    sender: 'user',
    timestamp: new Date('2024-03-15T10:01:00'),
  },
  {
    id: '3',
    content:
      "Of course! I'd be happy to help. What specific aspect of your portfolio would you like to discuss?",
    sender: 'agent',
    timestamp: new Date('2024-03-15T10:02:00'),
  },
]

export function BubbleChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <Card className='w-[400px] shadow-lg'>
      <CardHeader>
        <CardTitle className='text-lg'>Chat with Support</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[350px] pr-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex mb-4',
                message.sender === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              {message.sender === 'agent' && (
                <Avatar className='w-6 h-6 mr-2'>
                  <AvatarImage src='/agent-avatar.png' alt='Support Agent' />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'rounded-lg p-2 max-w-[70%]',
                  message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
              >
                <p className='text-xs'>{message.content}</p>
                <p className='text-[10px] mt-1 opacity-70'>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <Avatar className='w-6 h-6 ml-2'>
                  <AvatarImage src='/user-avatar.png' alt='User' />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className='flex w-full gap-2'
        >
          <Input
            placeholder='Type your message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className='text-xs'
          />
          <Button type='submit' size='sm'>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
