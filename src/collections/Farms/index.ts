import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone, isAdmin } from '@/access/roles'

export const Farms: CollectionConfig = {
  slug: 'farms',
  access: {
    read: anyone,

    create: ({ req }) => {
      return req.user?.role === 'farm' || req.user?.role === 'admin'
    },

    update: ({ req }) => {
      if (req.user?.role === 'admin') return true

      return {
        owner: {
          equals: req.user?.id,
        },
      }
    },

    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
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
      name: 'type',
      type: 'select',
      options: ['produce', 'dairy', 'livestock', 'mixed', 'orchard'],
    },

    {
      name: 'organic',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'region',
      type: 'text',
    },

    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'latitude',
          type: 'number',
        },
        {
          name: 'longitude',
          type: 'number',
        },
      ],
    },

    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
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
