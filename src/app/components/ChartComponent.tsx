'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useState } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

interface Dataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  fill: boolean
  yAxisID: string
  datalabels: {
    display: boolean
    backgroundColor: string
    borderRadius: number
    color: string
    font: {
      weight: string
    }
    padding: number
  }
}

export default function ChartComponent() {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [showChart, setShowChart] = useState(false)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [inputLabels, setInputLabels] = useState('')
  const [chartTitle, setChartTitle] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [legendPosition, setLegendPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')

  const [newDatasetLabel, setNewDatasetLabel] = useState('')
  const [newDatasetData, setNewDatasetData] = useState('')
  const [newDatasetColor, setNewDatasetColor] = useState('#4BC0C0')
  const [newDatasetAxis, setNewDatasetAxis] = useState('y')

  const addDataset = () => {
    const newDataset: Dataset = {
      label: newDatasetLabel,
      data: newDatasetData.split(',').map(num => Number(num.trim())),
      borderColor: newDatasetColor,
      backgroundColor: newDatasetColor,
      fill: false,
      yAxisID: newDatasetAxis,
      datalabels: {
        display: true,
        backgroundColor: 'white',
        borderRadius: 4,
        color: newDatasetColor,
        font: {
          weight: 'bold' as const
        },
        padding: 6
      }
    }
    setDatasets([...datasets, newDataset])
    clearForm()
  }

  const startEditing = (index: number) => {
    const dataset = datasets[index]
    setNewDatasetLabel(dataset.label)
    setNewDatasetData(dataset.data.join(', '))
    setNewDatasetColor(dataset.borderColor)
    setNewDatasetAxis(dataset.yAxisID)
    setEditingIndex(index)
  }

  const updateDataset = () => {
    if (editingIndex === null) return

    const updatedDatasets = [...datasets]
    updatedDatasets[editingIndex] = {
      label: newDatasetLabel,
      data: newDatasetData.split(',').map(num => Number(num.trim())),
      borderColor: newDatasetColor,
      backgroundColor: newDatasetColor,
      fill: false,
      yAxisID: newDatasetAxis,
      datalabels: {
        display: true,
        backgroundColor: newDatasetColor,
        borderRadius: 4,
        color: 'white',
        font: {
          weight: 'bold' as const
        },
        padding: 6
      }
    }

    setDatasets(updatedDatasets)
    clearForm()
  }

  const deleteDataset = (index: number) => {
    const updatedDatasets = datasets.filter((_, i) => i !== index)
    setDatasets(updatedDatasets)
  }

  const clearForm = () => {
    setNewDatasetLabel('')
    setNewDatasetData('')
    setNewDatasetColor('#4BC0C0')
    setNewDatasetAxis('y')
    setEditingIndex(null)
  }

  const handleGenerateChart = () => {
    setShowChart(true)
  }

  const data = {
    labels: inputLabels.split(',').map(label => label.trim()),
    datasets: datasets,
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'top' as const,
        anchor: 'end' as const,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 8
      },
      legend: {
        position: legendPosition,
        display: true,
      },
      title: {
        display: false,
        text: chartTitle,
      }
    },

    scales: {
      y: {
        type: 'linear' as const,
        display: false,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    layout: {
      padding: 20
    },
    backgroundColor: 'white'
  }

  const exportToHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
          <title>${chartTitle}</title>
          <style>
            body {
              font-family: 'Montserrat', sans-serif;
            }
          </style>
        </head>
        <body class="p-8">
          <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">${chartTitle}</h1>

              <div class="chart-container relative h-[600px] w-full">
                <canvas id="myChart"></canvas>
              </div>
              
            </div>
          </div>

          <script>
            const ctx = document.getElementById('myChart');
            const data = ${JSON.stringify(data)};
            const options = ${JSON.stringify({
              ...options,
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                ...options.plugins,
                title: {
                  display: false
                }
              }
            })};
            
            Chart.register(ChartDataLabels);
            Chart.register(Chart.Legend);
            
            new Chart(ctx, {
              type: '${chartType}',
              data: data,
              options: options
            });
          </script>
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${chartTitle || 'chart'}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }


  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Título do Gráfico</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            placeholder="Qual é o Título do Gráfico?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rótulos (separados por vírgula)</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={inputLabels}
            onChange={(e) => setInputLabels(e.target.value)}
            placeholder="Examplo: Jan, Fev, Mar, Abr, Mai"
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-3">
            {editingIndex !== null ? 'Editar Dados' : 'Adicionar Dados'}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              className="input input-bordered w-full"
              value={newDatasetLabel}
              onChange={(e) => setNewDatasetLabel(e.target.value)}
              placeholder="Nome do dado"
            />
            <input
              type="text"
              className="input input-bordered w-full"
              value={newDatasetData}
              onChange={(e) => setNewDatasetData(e.target.value)}
              placeholder="Valores do dado (separados por vírgula)"
            />
            <div className="flex gap-4">
              <input
                type="color"
                className="input input-bordered h-10"
                value={newDatasetColor}
                onChange={(e) => setNewDatasetColor(e.target.value)}
              />
              <select
                className="select select-bordered flex-1"
                value={newDatasetAxis}
                onChange={(e) => setNewDatasetAxis(e.target.value)}
              >
                <option value="y">Eixo Esquerdo</option>
                <option value="y1">Eixo direito</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-secondary flex-1"
                onClick={editingIndex !== null ? updateDataset : addDataset}
              >
                {editingIndex !== null ? 'Atualizar Dados' : 'Adicionar Dados'}
              </button>
              {editingIndex !== null && (
                <button
                  className="btn btn-outline"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {datasets.length > 0 && (
          <div className="border p-4 rounded-lg mt-4">
            <h3 className="font-medium mb-2">Dados Atuais:</h3>
            <ul className="space-y-2">
              {datasets.map((dataset, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-base-200 rounded">
                  <span style={{ color: dataset.borderColor }}>
                    {dataset.label} ({dataset.yAxisID === 'y' ? 'Left' : 'Right'} Axis)
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => startEditing(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => deleteDataset(index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Gráfico</label>
          <select
            className="select select-bordered w-full"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
          >
            <option value="line">Linha</option>
            <option value="bar">Barra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Posição da Legenda</label>
          <select
            className="select select-bordered w-full"
            value={legendPosition}
            onChange={(e) => setLegendPosition(e.target.value as 'top' | 'bottom' | 'left' | 'right')}
          >
            <option value="top">Topo</option>
            <option value="bottom">Base</option>
            <option value="left">Esquerda</option>
            <option value="right">Direita</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-full"
          onClick={handleGenerateChart}
          disabled={datasets.length === 0}
        >
          Gerar Gráfico
        </button>
      </div>

      <div className="flex gap-2 pb-24">
        {showChart && (
          <button
            className="btn btn-secondary flex-1"
            onClick={exportToHTML}
          >
            Exportar HTML
          </button>
        )}
      </div>

      {showChart && (
        <div className="w-full h-[400px]">
          {chartType === 'line' ? (
            <Line options={options} data={data} />
          ) : (
            <Bar options={options} data={data} />
          )}
        </div>
      )}
    </div>
  )
}
