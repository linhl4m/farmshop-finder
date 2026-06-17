import type { CollectionConfig } from 'payload'
import { updateFarmRatingAfterChange, updateFarmRatingAfterDelete } from './hooks/updateFarmRating'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [updateFarmRatingAfterChange],
    afterDelete: [updateFarmRatingAfterDelete],
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: false,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'comment',
      type: 'textarea',
    },
  ],
}
