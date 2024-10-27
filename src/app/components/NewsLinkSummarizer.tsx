import { useState } from 'react'

export default function NewsLinkSummarizer() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole aqui o link da notícia"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Resumindo...' : 'Resumir'}
        </button>
      </form>
      {summary && (
        <div className="mt-6 p-4 bg-base-100 rounded-lg shadow-md w-full">
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  )
}
