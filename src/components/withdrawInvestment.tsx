'use server'

export async function withdrawInvestment(formData: FormData) {
  const amount = formData.get('amount')
  const contractId = formData.get('contractId')
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: `Successfully initiated withdrawal of ${amount} from contract ${contractId}`
  }
}

