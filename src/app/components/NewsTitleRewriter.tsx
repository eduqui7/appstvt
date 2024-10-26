'use client'

import { useState } from 'react'

interface TitleResponse {
  newTitle: string
  error?: string
}

export default function NewsTitleRewriter() {
  const [newsLink, setNewsLink] = useState('')
  const [newTitle, setNewTitle] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newsLink.trim()) {
      setNewTitle('Por favor insira uma URL válida')
      return
    }
    setLoading(true)
    console.log('Submitting URL:', newsLink) // Add this line

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newsLink, type: 'title' }),
      })

      const data: TitleResponse = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setNewTitle(data.newTitle)
    } catch (error) {
      console.error('Erro ao reescrever título:', error)
      setNewTitle('Falha ao gerar novo título. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-2/4 mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reescrever Título com AI</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsLink" className="block mb-2">
            Cole o URL da notícia:
          </label>
          <input
            id="newsLink"
            type="url"
            value={newsLink}
            onChange={(e) => setNewsLink(e.target.value)}
            className="w-full p-2 rounded bg-base-100"
            placeholder="https://"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Reescrevendo Título...' : 'Reescrever Título'}
        </button>
      </form>

      {newTitle && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Novo Título:</h2>
          <div className="bg-base-100 w-full p-4 rounded">{newTitle}</div>
        </div>
      )}
    </div>
  )
}
