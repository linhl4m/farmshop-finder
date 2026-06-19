import type { CollectionConfig } from 'payload'
import { createOrderSnapshot } from './hooks/createOrderSnapshot'
import { isAdmin } from '@/access/roles'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true

      if (req.user?.role === 'customer') {
        return {
          customer: {
            equals: req.user.id,
          },
        }
      }

      if (req.user?.role === 'farm') {
        return {
          farm: {
            equals: req.user.id,
          },
        }
      }

      return false
    },

    create: ({ req }) => {
      return req.user?.role === 'customer' || req.user?.role === 'admin'
    },

    update: ({ req }) => {
      return req.user?.role === 'admin' || req.user?.role === 'farm'
    },

    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'id',
  },
  hooks: {
    beforeChange: [createOrderSnapshot],
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
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'priceSnapshot',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'unitSnapshot',
          type: 'text',
        },
        {
          name: 'productNameSnapshot',
          type: 'text',
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
    },
  ],
}
