import { slugField, type CollectionConfig } from 'payload'
import { anyone } from '@/access/roles'
import { setFarmFromUser } from './hooks/setFarmFromUser'

export const Products: CollectionConfig = {
  slug: 'products',

  access: {
    read: anyone,

    create: ({ req }) => {
      return req.user?.role === 'farm' || req.user?.role === 'admin'
    },

    update: async ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.role !== 'farm') return false

      const farm = await req.payload.find({
        collection: 'farms',
        where: {
          owner: {
            equals: req.user.id,
          },
        },
        limit: 1,
      })

      const farmId = farm.docs[0]?.id

      if (!farmId) return false

      return {
        farm: {
          equals: farmId,
        },
      }
    },

    delete: async ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.role !== 'farm') return false

      const farm = await req.payload.find({
        collection: 'farms',
        where: {
          owner: {
            equals: req.user.id,
          },
        },
        limit: 1,
      })

      const farmId = farm.docs[0]?.id

      if (!farmId) return false

      return {
        farm: {
          equals: farmId,
        },
      }
    },
  },

  admin: {
    useAsTitle: 'name',
  },

  hooks: {
    beforeValidate: [setFarmFromUser],
  },

  fields: [
    {
      name: 'farm',
      type: 'relationship',
      relationTo: 'farms',
      required: true,
    },

    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },

    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'unit',
      type: 'select',
      required: true,
      options: ['kg', 'lb', 'dozen', 'bunch', 'piece'],
    },

    {
      name: 'productCategory',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
    },

    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'in_season',
      options: [
        {
          label: 'In Season',
          value: 'in_season',
        },
        {
          label: 'Out of Season',
          value: 'out_of_season',
        },
        {
          label: 'Sold Out',
          value: 'sold_out',
        },
      ],
    },
    {
      name: 'ratingAverage',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'ratingCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    slugField({
      useAsSlug: 'name',
    }),
  ],
}
