import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: isAdmin,
    create: anyone,
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true

      return {
        id: {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true

      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true

      return {
        id: {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        {
          label: 'Customer',
          value: 'customer',
        },
        {
          label: 'Farm',
          value: 'farm',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
    },
  ],
  timestamps: true,
}
