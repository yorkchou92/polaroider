import { useState, useRef, FormEvent, useEffect } from 'react'

import Cropper from 'cropperjs'

import { Metadata, getImageMetadata } from '@/utils'

export function useCanvas() {
  const [metadata, setMetadata] = useState<Metadata>()
  const [polaroidURL, setPolaroidURL] = useState<string>('')
  let cropper: Cropper | null = null

  const [cropDialogIsOpen, setCropDialogIsOpen] = useState(false)
  const [downloadDialogIsOpen, setDownloadDialogIsOpen] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  async function loadImageToCrop({
    currentTarget,
  }: FormEvent<HTMLInputElement>) {
    if (!currentTarget.files) return

    const file = currentTarget.files[0]

    if (!file) return

    setCropDialogIsOpen(true)

    const metadata = await getImageMetadata(file)
    setMetadata(metadata)
  }

  useEffect(() => {
    if (metadata && cropDialogIsOpen) {
      const imageToCrop = document.querySelector(
        '#image-to-crop',
      ) as HTMLImageElement

      if (!imageToCrop) return

      imageToCrop.src = metadata.localUrl

      // eslint-disable-next-line react-hooks/exhaustive-deps
      cropper = new Cropper(imageToCrop, {
        aspectRatio: 1 / 1,
        background: false,
        viewMode: 0,
      })
    }
  }, [metadata, cropDialogIsOpen])

  function getCroppedImage() {
    if (!cropper) return

    const croppedImage = cropper.getCroppedCanvas().toDataURL('image/png')

    setCropDialogIsOpen(false)
    setDownloadDialogIsOpen(true)

    if (!croppedImage) return
    drawImageOnCanvas(croppedImage)
  }

  function drawImageOnCanvas(src: string) {
    const img = new Image()
    img.setAttribute('src', src)

    img.addEventListener('load', () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      // 设置画布尺寸
      canvas.width = 736
      canvas.height = 880

      // 填充背景色
      context.fillStyle = 'rgb(248 250 252)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      // 应用滤镜并绘制裁剪后的图像
      context.filter = 'brightness(1.05) saturate(0.8)'
      context.drawImage(img, 50, 77, 640, 640)

      // 取消滤镜（应用噪声时需要取消滤镜）
      context.filter = 'none'

      // 加载背景图像并绘制
      const background = new Image()
      background.src = '/polaroids/export/square_scale.png'

      background.addEventListener('load', () => {
        // 在裁剪后的图像之后绘制背景图像
        context.drawImage(background, 0, 0, canvas.width, canvas.height)

        // 获取绘制后的图像数据以应用噪声
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        )
        applyNoise(context, imageData, 0.1)

        // 最终将合成的图像保存为 URL
        setPolaroidURL(canvas.toDataURL('image/png', 2.0))
      })
    })
  }

  function applyNoise(
    context: CanvasRenderingContext2D,
    imageData: ImageData,
    noiseLevel: number,
  ): void {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * noiseLevel * 255
      data[i] += noise // Red channel
      data[i + 1] += noise // Green channel
      data[i + 2] += noise // Blue channel
    }
    context.putImageData(imageData, 0, 0)
  }

  function clearMetadata() {
    setMetadata(undefined)
    setPolaroidURL('')

    setCropDialogIsOpen(false)
    setDownloadDialogIsOpen(false)
  }

  return {
    canvasRef,
    clearMetadata,
    cropDialogIsOpen,
    downloadDialogIsOpen,
    getCroppedImage,
    loadImageToCrop,
    metadata,
    polaroidURL,
  }
}
