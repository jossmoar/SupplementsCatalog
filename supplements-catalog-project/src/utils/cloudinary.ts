// Sube una foto directo desde el navegador a Cloudinary (plan gratuito,
// no requiere tarjeta ni backend propio) y devuelve la URL pública de la
// imagen para guardarla en el producto.
//
// Necesita dos variables de entorno (ver .env.example):
//   VITE_CLOUDINARY_CLOUD_NAME
//   VITE_CLOUDINARY_UPLOAD_PRESET
export async function uploadProductImage(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Falta configurar VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en .env',
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'productos')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData },
  )

  if (!res.ok) {
    throw new Error('No se pudo subir la imagen a Cloudinary')
  }

  const data = await res.json()
  return data.secure_url as string
}
