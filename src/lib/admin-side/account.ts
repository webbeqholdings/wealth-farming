import { Payload } from 'payload'

export const getAccountsByUserId = async (
  payload: Payload,
  user_id: number,
  account_types = ['investment', 'main'],
): Promise<any> => {
  // auth()-> user
  // Query --> collection accounts
  const response = await payload.find({
    collection: 'accounts',
    where: {
      user: { equals: user_id },
    },
  }) // response.docs = array[n ket qua]

  if (!response.docs.length) return false // acc nap rut, referral, invesment
  console.log(response.docs.length)

  let array = response.docs.filter((item: any) => {
    return account_types.includes(item.type)
  })

  if (array.length == 1) {
    return response.docs[0]
  }

  return array
}
