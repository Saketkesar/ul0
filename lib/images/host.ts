import "server-only"

export interface ImageHostAdapter {
  upload(buffer: Buffer, filename: string, mimeType: string): Promise<{ url: string }>
}

const DEFAULT_FREEIMAGE_KEY = "6d207e02198a847aa98d0a2a901485a5"

/**
 * Freeimage.host API v1 implementation.
 */
class FreeimageHostAdapter implements ImageHostAdapter {
  async upload(buffer: Buffer, filename: string, mimeType: string): Promise<{ url: string }> {
    const key = process.env.FREEIMAGE_API_KEY || DEFAULT_FREEIMAGE_KEY
    const base64 = buffer.toString("base64")

    const formData = new FormData()
    formData.append("key", key)
    formData.append("action", "upload")
    formData.append("format", "json")
    formData.append("source", base64)

    const res = await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Image host returned error HTTP ${res.status}`)
    }

    const data = await res.json()
    if (!data || data.status_code !== 200 || !data.image?.url) {
      throw new Error(data?.error?.message || "Failed to upload image to host.")
    }

    return { url: data.image.url }
  }
}

/**
 * Appwrite Storage Adapter stub (for future migration without DB changes).
 */
class AppwriteStorageAdapter implements ImageHostAdapter {
  async upload(_buffer: Buffer, _filename: string, _mimeType: string): Promise<{ url: string }> {
    throw new Error("Appwrite storage adapter is not yet enabled.")
  }
}

// Default export uses Freeimage.host adapter
export const imageHost: ImageHostAdapter = new FreeimageHostAdapter()
export { FreeimageHostAdapter, AppwriteStorageAdapter }
