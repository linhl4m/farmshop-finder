import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const password = 'test123456'

const productCategories = [
  { name: 'Produce', value: 'produce' },
  { name: 'Dairy', value: 'dairy' },
  { name: 'Eggs', value: 'eggs' },
  { name: 'Meat', value: 'meat' },
  { name: 'Honey', value: 'honey' },
  { name: 'Baked Goods', value: 'baked_goods' },
] as const

const farms = [
  {
    name: 'Sunny Orchard',
    email: 'sunny-orchard@example.com',
    type: 'orchard',
    organic: false,
    region: 'Brandenburg',
    city: 'Potsdam',
    address: 'Obstweg 5',
    latitude: 52.3906,
    longitude: 13.0645,
    description:
      'Sunny Orchard grows seasonal apples, pears, cherries, and fresh fruit for local customers.',
    products: [
      ['Honeycrisp Apples', 'produce', 3.5, 'kg', 80],
      ['Conference Pears', 'produce', 4.2, 'kg', 60],
      ['Sweet Cherries', 'produce', 7.9, 'kg', 40],
      ['Apple Juice', 'produce', 3.8, 'piece', 35],
    ],
  },
  {
    name: 'Meadow Dairy',
    email: 'meadow-dairy@example.com',
    type: 'dairy',
    organic: true,
    region: 'Brandenburg',
    city: 'Beelitz',
    address: 'Lindenweg 8',
    latitude: 52.2384,
    longitude: 12.9697,
    description:
      'Meadow Dairy produces fresh milk, yogurt, butter, and artisan cheese from grass-fed cows.',
    products: [
      ['Whole Milk', 'dairy', 2.2, 'piece', 50],
      ['Greek Yogurt', 'dairy', 3.9, 'piece', 40],
      ['Farmhouse Cheese', 'dairy', 8.5, 'piece', 25],
      ['Salted Butter', 'dairy', 4.5, 'piece', 30],
    ],
  },
  {
    name: 'Golden Fields Farm',
    email: 'golden-fields@example.com',
    type: 'produce',
    organic: true,
    region: 'Brandenburg',
    city: 'Brandenburg an der Havel',
    address: 'Feldstraße 18',
    latitude: 52.4125,
    longitude: 12.5316,
    description:
      'Golden Fields Farm focuses on seasonal vegetables grown with sustainable farming methods.',
    products: [
      ['Red Potatoes', 'produce', 2.4, 'kg', 120],
      ['Yellow Onions', 'produce', 1.8, 'kg', 100],
      ['Fresh Spinach', 'produce', 2.9, 'bunch', 45],
      ['Beetroot', 'produce', 2.7, 'kg', 70],
    ],
  },
  {
    name: 'Riverbank Farm',
    email: 'riverbank@example.com',
    type: 'mixed',
    organic: false,
    region: 'Brandenburg',
    city: 'Werder',
    address: 'Uferweg 14',
    latitude: 52.3786,
    longitude: 12.9346,
    description:
      'Riverbank Farm offers eggs, meat, and seasonal produce from a small mixed family farm.',
    products: [
      ['Free Range Chicken', 'meat', 12.5, 'kg', 20],
      ['Duck Eggs', 'eggs', 5.5, 'dozen', 18],
      ['Pumpkin', 'produce', 3.2, 'kg', 35],
      ['Sweet Corn', 'produce', 1.2, 'piece', 90],
    ],
  },
  {
    name: 'Hilltop Honey Farm',
    email: 'hilltop-honey@example.com',
    type: 'mixed',
    organic: true,
    region: 'Brandenburg',
    city: 'Falkensee',
    address: 'Bienenweg 7',
    latitude: 52.5601,
    longitude: 13.0927,
    description:
      'Hilltop Honey Farm produces raw honey, honeycomb, and bee products from local wildflower fields.',
    products: [
      ['Wildflower Honey', 'honey', 9.9, 'piece', 45],
      ['Forest Honey', 'honey', 11.9, 'piece', 30],
      ['Bee Pollen', 'honey', 7.5, 'piece', 25],
      ['Honeycomb', 'honey', 14.9, 'piece', 15],
    ],
  },
] as const

const customers = [
  'anna@example.com',
  'max@example.com',
  'sophie@example.com',
  'lucas@example.com',
  'emma@example.com',
]

async function seed() {
  console.log('Seed started')
  const payload = await getPayload({ config })
  await payload.delete({
    collection: 'reviews',
    where: {},
  })

  await payload.delete({
    collection: 'products',
    where: {},
  })

  await payload.delete({
    collection: 'farms',
    where: {},
  })

  await payload.delete({
    collection: 'users',
    where: {},
  })

  await payload.delete({
    collection: 'product-categories',
    where: {},
  })
  console.log('Database cleared')
  console.log('Payload initialized')

  await payload.create({
    collection: 'users',
    draft: false,
    data: {
      email: 'admin@farmshop.com',
      password: 'admin',
      role: 'admin',
    },
  })

  const customerDocs = []

  for (const email of customers) {
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    const user =
      existingUser.docs[0] ??
      (await payload.create({
        collection: 'users',
        draft: false,
        data: {
          email,
          password,
          role: 'customer',
        },
      }))

    customerDocs.push(user)
  }

  const categoryMap = new Map<string, string>()

  for (const category of productCategories) {
    const createdCategory = await payload.create({
      collection: 'product-categories',
      draft: false,
      data: { name: category.name } as any,
    })

    categoryMap.set(category.value, createdCategory.id)
  }

  for (const farmData of farms) {
    const existingFarmUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: farmData.email,
        },
      },
      limit: 1,
    })

    const farmUser =
      existingFarmUser.docs[0] ??
      (await payload.create({
        collection: 'users',
        draft: false,
        data: {
          email: farmData.email,
          password,
          role: 'farm',
        },
      }))

    const existingFarm = await payload.find({
      collection: 'farms',
      where: {
        name: {
          equals: farmData.name,
        },
      },
      limit: 1,
    })

    const farm =
      existingFarm.docs[0] ??
      (await payload.create({
        collection: 'farms',
        draft: false,
        data: {
          owner: farmUser.id,
          name: farmData.name,
          description: farmData.description,
          type: farmData.type,
          organic: farmData.organic,
          region: farmData.region,
          location: {
            address: farmData.address,
            city: farmData.city,
            latitude: farmData.latitude,
            longitude: farmData.longitude,
          },
        } as any,
      }))

    const productDocs = []

    for (const [name, category, price, unit, stock] of farmData.products) {
      const categoryId = categoryMap.get(category)
      const product = await payload.create({
        collection: 'products',
        draft: false,
        data: {
          farm: farm.id,
          name,
          description: `${name} from ${farmData.name}, freshly prepared for local customers.`,
          productCategory: categoryId,
          price,
          unit,
          stock,
          status: 'in_season',
        } as any,
      })

      productDocs.push(product)
    }

    await payload.create({
      collection: 'reviews',
      data: {
        customer: customerDocs[Math.floor(Math.random() * customerDocs.length)].id,
        farm: farm.id,
        product: productDocs[0].id,
        rating: Math.random() > 0.4 ? 5 : 4,
        title: 'Great local quality',
        comment: `Really enjoyed ordering from ${farmData.name}. Everything was fresh and pickup was easy.`,
      },
    })
  }

  console.log('Seed complete')
  process.exit(0)
}

seed().catch((error) => {
  console.dir(error, { depth: null })
  process.exit(1)
})
