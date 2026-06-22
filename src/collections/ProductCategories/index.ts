import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/access/roles'
import { slugField } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',

  access: {
    read: anyone,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },

  admin: {
    useAsTitle: 'name',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    slugField({
      useAsSlug: 'name',
    }),
  ],
}
