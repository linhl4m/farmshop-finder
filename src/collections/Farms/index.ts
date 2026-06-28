import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '@/access/roles'

export const Farms: CollectionConfig = {
  slug: 'farms',
  access: {
    read: anyone,
    create: ({ req: { user } }) => user?.role === 'farm' || user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true

      return {
        owner: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true

      return {
        owner: {
          equals: user?.id,
        },
      }
    },
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
      unique: true,
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'gallery',
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
