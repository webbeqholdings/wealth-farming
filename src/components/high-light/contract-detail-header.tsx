import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, DollarSign, FileText, Mail, Phone, User } from 'lucide-react'

interface ContractUser {
  id: number
  name: string
  email: string
  status: string
  role: string
  lastActive: string
  phone: string
  address: string
  joinDate: string
  bio: string
}

interface Contract {
  id: string
  userId: number
  title: string
  value: number
  startDate: string
  endDate: string
  status: string
  description: string
  client: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  terms: string
  renewalOption: boolean
}

interface ContractDetailHeaderProps {
  contract: Contract
  user?: ContractUser
}

export default function ContractDetailHeader({ contract, user }: ContractDetailHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-bold">{contract.title}</h2>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={contract.status === 'Active' ? 'success' : 'destructive'}>
                  {contract.status}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Contract ID: {contract.id}</span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
              <div className="text-2xl font-bold text-primary">
                ${contract.value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">{contract.terms} payment terms</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Contract Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Contract Period</div>
                    <div className="text-sm text-muted-foreground">
                      {contract.startDate} to {contract.endDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Payment Schedule</div>
                    <div className="text-sm text-muted-foreground">
                      Initial: ${(contract.value * 0.3).toLocaleString()} • Milestone: $
                      {(contract.value * 0.3).toLocaleString()} • Final: $
                      {(contract.value * 0.4).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Renewal Option</div>
                    <div className="text-sm text-muted-foreground">
                      {contract.renewalOption ? 'Available for renewal' : 'No renewal option'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Client Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Client</div>
                    <div className="text-sm text-muted-foreground">{contract.client}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Contact Person</div>
                    <div className="text-sm text-muted-foreground">{contract.contactPerson}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{contract.contactEmail}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{contract.contactPhone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{contract.description}</p>
          </div>

          {user && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Managed by:</span>
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-sm text-muted-foreground">({user.email})</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
