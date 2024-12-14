'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calculator, TrendingUp, PiggyBank, BarChart3 } from 'lucide-react'

const tools = [
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    description: 'Calculate the growth of your investments over time.',
    icon: <TrendingUp className='h-6 w-6' />,
    category: 'calculators',
  },
  {
    id: 'investment-simulator',
    name: 'Investment Simulator',
    description: 'Simulate different investment scenarios and outcomes.',
    icon: <BarChart3 className='h-6 w-6' />,
    category: 'simulators',
  },
  {
    id: 'savings-goal',
    name: 'Savings Goal Calculator',
    description: 'Plan your savings to reach your financial goals.',
    icon: <PiggyBank className='h-6 w-6' />,
    category: 'calculators',
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Quiz',
    description: 'Evaluate your investment risk tolerance.',
    icon: <Calculator className='h-6 w-6' />,
    category: 'quizzes',
  },
]

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Explore Tools</h1>

      <div className='mb-6'>
        <Input
          type='search'
          placeholder='Search tools...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-md'
        />
      </div>

      <Tabs defaultValue='all' className='mb-8'>
        <TabsList>
          <TabsTrigger value='all'>All Tools</TabsTrigger>
          <TabsTrigger value='calculators'>Calculators</TabsTrigger>
          <TabsTrigger value='simulators'>Simulators</TabsTrigger>
          <TabsTrigger value='quizzes'>Quizzes</TabsTrigger>
        </TabsList>

        <ScrollArea className='h-[600px] w-full rounded-md border p-4 my-4'>
          <TabsContent value='all'>
            <ToolGrid tools={filteredTools} />
          </TabsContent>
          <TabsContent value='calculators'>
            <ToolGrid tools={filteredTools.filter((tool) => tool.category === 'calculators')} />
          </TabsContent>
          <TabsContent value='simulators'>
            <ToolGrid tools={filteredTools.filter((tool) => tool.category === 'simulators')} />
          </TabsContent>
          <TabsContent value='quizzes'>
            <ToolGrid tools={filteredTools.filter((tool) => tool.category === 'quizzes')} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

function ToolGrid({ tools }: { tools: any }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {tools.map((tool: any) => (
        <Card key={tool.id}>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {tool.icon}
              {tool.name}
            </CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>Launch Tool</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
