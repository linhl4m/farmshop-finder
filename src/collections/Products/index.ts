import { slugField, type CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
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
      name: 'slug',
      type: 'text',
      unique: true,
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
      name: 'category',
      type: 'select',
      required: true,
      options: ['produce', 'dairy', 'eggs', 'meat', 'honey', 'baked_goods'],
    },

    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'available',
      options: ['available', 'sold_out', 'out_of_season'],
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
