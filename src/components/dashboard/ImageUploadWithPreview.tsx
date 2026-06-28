'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload } from 'lucide-react'

const MAX_SIZE_BYTES = 1 * 1024 * 1024 // 1MB

type Props = {
  existingImageUrl?: string | null
  existingImageAlt?: string
}

export function ImageUploadWithPreview({ existingImageUrl, existingImageAlt }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      setPreviewUrl(null)
      setSizeError(null)
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError('The file size must not exceed 1 MB.')
      e.target.value = ''
      setPreviewUrl(null)
      return
    }

    setSizeError(null)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const displayUrl = previewUrl ?? existingImageUrl ?? null

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-primary">Farm Cover Image*</label>
      {displayUrl && (
        <Image
          src={displayUrl}
          alt={existingImageAlt ?? 'Farm cover image'}
          width={300}
          height={200}
          unoptimized={!!previewUrl}
          className="mb-4 h-64 w-full rounded-xl object-cover"
        />
      )}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        <Upload className="hidden shrink-0 sm:block" size={20} />
        <input
          ref={inputRef}
          type="file"
          name="coverImage"
          accept="image/*"
          required={!existingImageUrl}
          onChange={handleFileChange}
          className="w-full min-w-0 max-w-full cursor-pointer rounded-xl border px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">Max file size: 1 MB</p>
      {sizeError && <p className="mt-1 text-sm font-medium text-destructive">{sizeError}</p>}
    </div>
  )
}
