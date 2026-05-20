'use client'

import { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'

interface ProductImageGalleryProps {
  images: string[]
  cloudinaryIds: string[]
  alt: string
}

export function ProductImageGallery({ images, cloudinaryIds, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mainCloudId = cloudinaryIds[activeIndex]
  const mainUrl = images[activeIndex]

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200 relative">
        <AnimatePresence mode="wait">
          <m.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {mainCloudId ? (
              <CldImage
                src={mainCloudId}
                width={1200}
                height={1200}
                crop="pad"
                background="white"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={alt}
                priority={true}
                className="h-full w-full object-contain object-center"
              />
            ) : (
              <Image
                src={mainUrl}
                alt={alt}
                width={1200}
                height={1200}
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-contain object-center"
              />
            )}
          </m.div>
        </AnimatePresence>
      </div>
      {images.length > 1 ? (
        <ThumbnailGrid
          images={images}
          cloudinaryIds={cloudinaryIds}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          alt={alt}
        />
      ) : null}
    </div>
  )
}

function ThumbnailGrid({
  images,
  cloudinaryIds,
  activeIndex,
  onSelect,
  alt,
}: {
  images: string[]
  cloudinaryIds: string[]
  activeIndex: number
  onSelect: (index: number) => void
  alt: string
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {images.map((img, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(idx)}
          className={`aspect-square overflow-hidden rounded-xl border-2 bg-white transition-all ${
            activeIndex === idx
              ? 'border-orange-500 ring-2 ring-orange-500/30'
              : 'border-slate-200 hover:border-orange-300'
          }`}
        >
          {cloudinaryIds[idx] ? (
            <CldImage
              src={cloudinaryIds[idx]}
              width={400}
              height={400}
              crop="pad"
              background="white"
              sizes="(max-width: 768px) 25vw, 10vw"
              alt={`${alt} thumbnail ${idx + 1}`}
              className="h-full w-full object-contain bg-white"
            />
          ) : (
            <Image
              src={img}
              alt=""
              width={400}
              height={400}
              sizes="(max-width: 768px) 25vw, 10vw"
              className="h-full w-full object-contain bg-white"
            />
          )}
        </button>
      ))}
    </div>
  )
}
