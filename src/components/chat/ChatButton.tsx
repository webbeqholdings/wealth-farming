'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BubbleChat } from '@/components/chat/BubbleChat'
import { MessageCircle, X } from 'lucide-react'

export function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {isChatOpen && (
        <div className='absolute bottom-16 right-0 mb-2'>
          <BubbleChat />
        </div>
      )}
      <Button
        size='icon'
        className='w-14 h-14 rounded-full shadow-lg'
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? <X className='h-6 w-6' /> : <MessageCircle className='h-6 w-6' />}
      </Button>
    </div>
  )
}
