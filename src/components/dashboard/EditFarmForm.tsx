import { EditFarmSubmit } from './EditFarmSubmit'
import { ImageUploadWithPreview } from './ImageUploadWithPreview'

type Props = {
  farm: any
}

export function EditFarmForm({ farm }: Props) {
  const existingImageUrl =
    farm.coverImage && typeof farm.coverImage === 'object' ? farm.coverImage?.url : null

  return (
    <EditFarmSubmit>
      <input type="hidden" name="farmId" value={farm.id} />

      <ImageUploadWithPreview existingImageUrl={existingImageUrl} existingImageAlt={farm.name} />

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">Farm Name*</label>
        <input
          name="name"
          required
          defaultValue={farm.name || ''}
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">Description*</label>
        <textarea
          name="description"
          required
          defaultValue={farm.description || ''}
          rows={6}
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Farm Type*</label>
          <select
            name="type"
            required
            defaultValue={farm.type || ''}
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option value="">Select type</option>
            <option value="produce">Produce</option>
            <option value="dairy">Dairy</option>
            <option value="livestock">Livestock</option>
            <option value="mixed">Mixed</option>
            <option value="orchard">Orchard</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Region*</label>
          <input
            name="region"
            required
            defaultValue={farm.region || ''}
            placeholder="e.g. Bavaria"
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input name="organic" type="checkbox" defaultChecked={Boolean(farm.organic)} />
        <span className="font-semibold text-primary">Organic farm</span>
      </label>

      <div className="py-5">
        <h2 className="mb-4 text-xl font-semibold text-primary">Location</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">Address*</label>
            <input
              name="address"
              required
              defaultValue={farm.location?.address || ''}
              className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">City*</label>
            <input
              name="city"
              required
              defaultValue={farm.location?.city || ''}
              className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">Latitude</label>
            <input
              name="latitude"
              type="number"
              step="any"
              defaultValue={farm.location?.latitude || ''}
              className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">Longitude</label>
            <input
              name="longitude"
              type="number"
              step="any"
              defaultValue={farm.location?.longitude || ''}
              className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </EditFarmSubmit>
  )
}
