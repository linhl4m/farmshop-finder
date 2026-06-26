import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/roles'

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true

      return {
        customer: {
          equals: req.user?.id,
        },
      }
    },
    create: ({ req }) => req.user?.role === 'customer',
    delete: ({ req }) => {
      if (req.user?.role === 'admin') return true

      return {
        customer: {
          equals: req.user?.id,
        },
      }
    },
    update: () => false,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'farm',
      type: 'relationship',
      relationTo: 'farms',
      required: true,
    },
  ],
}
