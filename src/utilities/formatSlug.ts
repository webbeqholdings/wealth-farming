import { FieldHook } from 'payload'
import slugify from 'slugify'

export const formatSlug =
  (field: string): FieldHook =>
  ({ data }) => {
    if (data[field]) {
      return slugify(data[field].toLowerCase())
    }
    return data.slug
  }