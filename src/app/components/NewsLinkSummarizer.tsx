'use client'

import { useState } from 'react'

interface SummaryResponse {
  summary: string
  error?: string
}

export default function NewsLinkSummarizer() {
  const [newsLink, setNewsLink] = useState('')
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newsLink, type: 'summary' }),
      })

      const data: SummaryResponse = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setSummary(data.summary)
    } catch (error) {
      console.error('Erro ao gerar resumo:', error)
      setSummary('Falha ao gerar resumo. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-2/4 mx-auto p-6">
      
      
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
          {loading ? 'Gerando Resumo...' : 'Gerar Resumo'}
        </button>
      </form>

      {summary && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Resumo:</h2>
          <div className="bg-base-100 w-full p-4 rounded">{summary}</div>
        </div>
      )}
    </div>
  )
}