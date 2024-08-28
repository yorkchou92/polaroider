'use client'

import Image from 'next/image'

import { FileImage } from 'lucide-react'

import { CropDialog, DownloadDialog, Rainbow } from '@/components'

import { useCanvas } from '@/hooks'

import camera from '../assets/camera.svg'

export default function Home() {
  const {
    canvasRef,
    clearMetadata,
    cropDialogIsOpen,
    downloadDialogIsOpen,
    getCroppedImage,
    loadImageToCrop,
    metadata,
    polaroidURL,
  } = useCanvas()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-grow items-center justify-center bg-zinc-50">
        <Rainbow />

        <div className="z-10 flex w-full flex-col items-center gap-12 px-8">
          <h1 className="text-center text-3xl font-bold leading-tight text-zinc-900 md:text-5xl">
            Infuse your photos <br /> with the essence of the past
          </h1>

          <Image
            alt="Polaroid camera illustration."
            className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[320px]"
            src={camera}
          />

          <form className="w-full sm:max-w-[320px]">
            <label
              htmlFor="image"
              className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-zinc-900 py-10 font-medium text-zinc-900 transition-opacity hover:opacity-70"
            >
              <FileImage className="h-7 w-7" />
              Upload image
            </label>

            <input
              onChange={loadImageToCrop}
              accept="image/png, image/jpg, image/jpeg"
              className="hidden"
              id="image"
              name="image"
              type="file"
            />
          </form>

          <CropDialog
            clearMetadata={clearMetadata}
            isOpen={cropDialogIsOpen}
            getCroppedImage={getCroppedImage}
          >
            <div className="flex items-center justify-center">
              <div>
                <Image
                  alt="Image to crop"
                  className="block h-40 w-fit lg:h-52 xl:h-60"
                  id="image-to-crop"
                  height={metadata?.height ?? 400}
                  src=""
                  width={metadata?.width ?? 400}
                />
              </div>
            </div>
          </CropDialog>

          {downloadDialogIsOpen && (
            <DownloadDialog
              clearMetadata={clearMetadata}
              isOpen
              url={polaroidURL}
            >
              <canvas className="w-60 shadow-2xl" ref={canvasRef}></canvas>
            </DownloadDialog>
          )}
        </div>
      </main>

      <footer className="w-full mt-auto p-4 bg-zinc-100 text-center text-zinc-700">
        <p>© 2024 Your Company. All rights reserved.</p>
        <p>
          <a href="https://yourcompany.com/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          {' | '}
          <a href="https://yourcompany.com/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  )
}
