import { GoogleGenerativeAI } from '@google/generative-ai'
import * as cheerio from 'cheerio'

const GEMINI_API_KEY = 'AIzaSyAMnqdpaSN04S4C-xxb-PEm6TWH4UY_Ifs'
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const { url, type } = await request.json()

    // Fetch the article content
    const responsefet = await fetch(url)
    const html = await responsefet.text()
    
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    if (type === 'summary') {
      const prompt = `escreva um resumo conciso e em pt-br desta notícia: ${html}`
      const result = await model.generateContent(prompt)
      const response = await result.response
      const summary = response.text().replace(/#/g, '')
      return Response.json({ summary })
    }

    if (type === 'title') {
      const $ = cheerio.load(html)
      const originalTitle = $('h1').first().text() || $('title').text()
      
      const prompt = `leia a materia e faça um titulo completamente novo da seguinte url: "${originalTitle}"`
      const result = await model.generateContent(prompt)
      const response = await result.response
      const newTitle = response.text().replace(/#/, '')
      return Response.json({ newTitle })
    }

  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Falha ao processar solicitação' }, { status: 500 })
  }
}
