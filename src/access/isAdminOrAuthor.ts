import { Access } from 'payload'

export const isAdminOrAuthor: Access = ({ req: { user }, id }) => {
  if (user?.role?.includes('admin')) return true
  return {
    author: {
      equals: user?.id,
    },
  }
}