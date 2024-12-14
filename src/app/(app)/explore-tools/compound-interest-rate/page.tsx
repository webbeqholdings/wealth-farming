'use client'

import { useState } from 'react'
import { CompoundInterestCalculator } from '@/components/interest-rate/CompoundInterestCalculator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const terms = [
  { name: 'Month', rate: 5.95, months: 24 },
  { name: 'Quarter', rate: 6.15, months: 24 },
  { name: 'Semester', rate: 6.35, months: 24 },
  { name: 'Annual', rate: 6.55, months: 24 },
]

export default function InvestmentSimulatorPage() {
  const [principal, setPrincipal] = useState<number>(10000)
  const [months, setMonths] = useState<number>(12)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Investment Simulator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Compare Investment Terms</CardTitle>
          <CardDescription>
            Adjust the initial deposit and compare different investment terms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="principal">Initial Deposit</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
              className="mt-1 max-w-xs"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="principal">Months</Label>
            <Input
              id="months"
              type="number"
              value={months}
              onChange={(e) => setMonths(parseFloat(e.target.value) || 12)}
              className="mt-1 max-w-xs"
            />
          </div>
          <Tabs defaultValue={terms[0].name.toLowerCase().replace(/\s+/g, '-')}>
            <TabsList className="grid w-full grid-cols-4">
              {terms.map((term) => (
                <TabsTrigger key={term.name} value={term.name.toLowerCase().replace(/\s+/g, '-')}>
                  {term.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {terms.map((term) => (
              <TabsContent key={term.name} value={term.name.toLowerCase().replace(/\s+/g, '-')}>
                <CompoundInterestCalculator
                  principal={principal}
                  monthlyRate={term.rate}
                  months={months}
                  termName={term.name}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
