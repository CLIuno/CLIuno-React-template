import api from '@/apis'

// Shared by the profile avatar picker and the post composer: pick a file,
// push it to POST /uploads/image, get an absolute URL back.
export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true)
    setUploadError(null)
    try {
      const res = await api.upload.uploadImage(file)
      return res.data.data.url as string
    } catch (err: unknown) {
      setUploadError(
        axios.isAxiosError(err) ? err.response?.data?.message || 'Upload failed' : 'Upload failed',
      )
      return null
    } finally {
      setUploading(false)
    }
  }, [])

  return { uploading, uploadError, uploadImage }
}
