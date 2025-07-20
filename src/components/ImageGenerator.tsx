import { useState } from 'react'
import axios from 'axios'
import './ImageGenerator.css'

function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!prompt) return
    setLoading(true)
    setError(null)
    setImageUrl(null)
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      const res = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          prompt,
          model: 'dall-e-3',
          n: 1,
          size: '1024x1024',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )
      const url = res.data.data[0]?.url
      if (url) {
        setImageUrl(url)
      } else {
        setError('Aucune image reçue')
      }
    } catch {
      setError('Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="image-generator-card">
      <input
        type="text"
        placeholder="Entrez un prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generate} disabled={loading}>
        Générer
      </button>
      {loading && <p className="loader">Chargement...</p>}
      {error && <p className="error">{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Résultat" />}
    </div>
  )
}

export default ImageGenerator
