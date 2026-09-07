import type { JourneyStep, PortfolioData, Project } from '@shared/types/portfolio'
import type { jsPDF as PdfDocument } from 'jspdf'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN_X = 15
const MARGIN_TOP = 13
const MARGIN_BOTTOM = 13
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getStartDate(date: string): number {
  const match = date.match(/^(?:(\w{3})\s+)?(\d{4})/)
  if (!match) return 0
  return Number(match[2]) * 12 + Math.max(0, MONTHS.indexOf(match[1]))
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))]
}

function getCoreSkills(data: PortfolioData) {
  const skills = unique([
    ...data.journey.flatMap((step) => step.skills),
    ...data.projects.flatMap((project) => project.tech),
  ])
  const groups: ReadonlyArray<readonly [string, readonly string[]]> = [
    ['Architecture & Platform', ['Architecture', 'Software Engineering', 'Kubernetes', 'Terraform', 'Datadog', 'CI/CD', 'Parallel Computing']],
    ['Frontend', ['TypeScript', 'JavaScript', 'Vue.js', 'React', 'HTML', 'CSS', 'NodeJS', 'Redux', 'WordPress', 'Web3']],
    ['AI & Data', ['AI Agents', 'AI', 'Machine Learning', 'PyTorch', 'Reinforcement Learning', 'NLP', 'CUDA', 'C++', 'Solidity']],
    ['Leadership', ['Scrum', 'Agile Delivery', 'Team Collaboration', 'Cross-cultural collaboration']],
  ]
  const assigned = new Set<string>()
  const categorized: Array<{ label: string; values: string[] }> = groups.map(([label, values]) => {
    const matches = values.filter((value) => skills.includes(value))
    matches.forEach((value) => assigned.add(value))
    return { label, values: matches }
  }).filter((group) => group.values.length > 0)
  const additional = skills.filter((skill) => !assigned.has(skill))
  if (additional.length > 0) categorized.push({ label: 'Additional', values: additional })
  return categorized
}

function getSummary(data: PortfolioData, work: JourneyStep[]): string {
  const current = work[0]
  const strengths = unique(work.flatMap((step) => step.skills)).slice(0, 8)
  const focus = strengths.length > 0 ? ` with experience across ${strengths.join(', ')}` : ''
  return `${data.personal.title}${focus}. ${current?.description ?? data.personal.bio}`
}

function createRenderer(doc: PdfDocument) {
  let y = MARGIN_TOP

  const lineHeight = (size: number, multiplier = 1.32) => size * 0.3528 * multiplier
  const ensureSpace = (height: number) => {
    if (y + height <= PAGE_HEIGHT - MARGIN_BOTTOM) return
    doc.addPage()
    y = MARGIN_TOP
  }
  const wrappedLines = (text: string, width = CONTENT_WIDTH): string[] => doc.splitTextToSize(text, width)
  const measureText = (text: string, size: number, width = CONTENT_WIDTH, multiplier = 1.32) => {
    doc.setFontSize(size)
    return wrappedLines(text, width).length * lineHeight(size, multiplier)
  }
  const text = (value: string, options: { size?: number; style?: 'normal' | 'bold' | 'italic'; width?: number; gap?: number; color?: number } = {}) => {
    const { size = 9.5, style = 'normal', width = CONTENT_WIDTH, gap = 0, color = 17 } = options
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(color)
    const lines = wrappedLines(value, width)
    const height = lines.length * lineHeight(size)
    ensureSpace(height)
    doc.text(lines, MARGIN_X, y)
    y += height + gap
  }
  const section = (title: string) => {
    ensureSpace(12)
    y += 3.2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(17)
    doc.text(title.toUpperCase(), MARGIN_X, y)
    y += 2
    doc.setDrawColor(119)
    doc.setLineWidth(0.25)
    doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y)
    y += 4.2
  }
  const bullet = (value: string) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    const width = CONTENT_WIDTH - 5
    const lines = wrappedLines(value, width)
    const height = lines.length * lineHeight(9.5)
    ensureSpace(height)
    doc.text('-', MARGIN_X + 1, y)
    doc.text(lines, MARGIN_X + 5, y)
    y += height + 0.5
  }
  const entry = (step: JourneyStep, education = false) => {
    const title = education ? `${step.title} — ${step.institution}` : `${step.institution} — ${step.title}`
    const titleWidth = 137
    const titleHeight = measureText(title, 10, titleWidth)
    const body = education
      ? [step.description, ...(step.details?.highlights ?? [])]
      : (step.details?.highlights?.length ? step.details.highlights : [step.description])
    const estimatedBody = body.reduce((height, value) => height + measureText(value, 9.5, CONTENT_WIDTH - (education ? 0 : 5)) + 0.5, 0)
    ensureSpace(titleHeight + 5 + estimatedBody + 5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(17)
    doc.text(wrappedLines(title, titleWidth), MARGIN_X, y)
    doc.text(step.year, PAGE_WIDTH - MARGIN_X, y, { align: 'right' })
    y += titleHeight
    text(`${step.city}, ${step.country}`, { size: 9, style: 'italic', gap: 1.2 })
    if (education) {
      text(step.description, { gap: 0.8 })
      step.details?.highlights?.forEach((highlight) => bullet(highlight))
    } else {
      body.forEach((highlight) => bullet(highlight))
    }
    y += 2.8
  }
  const project = (item: Project) => {
    const links = [item.url, item.github].filter(Boolean)
    const detail = `${item.description} Technologies: ${item.tech.join(', ')}.${links.length > 0 ? ` ${links.join(' · ')}` : ''}`
    const height = measureText(item.title, 10) + measureText(detail, 9.5) + 4
    ensureSpace(height)
    text(item.title, { size: 10, style: 'bold', gap: 0.7 })
    text(detail, { gap: 2.8 })
  }

  return { ensureSpace, text, section, bullet, entry, project, getY: () => y, setY: (value: number) => { y = value } }
}

export async function generateCvPdf(data: PortfolioData): Promise<Blob> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  const renderer = createRenderer(doc)
  const work = data.journey.filter((step) => step.type === 'work').sort((a, b) => getStartDate(b.year) - getStartDate(a.year))
  const education = data.journey.filter((step) => step.type === 'education').sort((a, b) => getStartDate(b.year) - getStartDate(a.year))
  const current = work[0]
  const website = data.projects.find((project) => project.url)?.url ?? 'https://francescodone.github.io'

  doc.setProperties({
    title: `${data.personal.name} — Curriculum Vitae`,
    subject: data.personal.title,
    author: data.personal.name,
    creator: 'francescodone.github.io',
    keywords: unique(data.journey.flatMap((step) => step.skills)).join(', '),
  })

  renderer.text(data.personal.name, { size: 21, style: 'bold', gap: 0.5 })
  renderer.text(data.personal.title, { size: 11, style: 'bold', gap: 1.5 })
  renderer.text(`${current?.city ?? ''}, ${current?.country ?? ''}  |  ${data.contact.email}  |  ${data.contact.linkedin}  |  ${data.contact.github}  |  ${website}`, { size: 9, gap: 2 })
  const headerRuleY = renderer.getY()
  doc.setDrawColor(34)
  doc.setLineWidth(0.45)
  doc.line(MARGIN_X, headerRuleY, PAGE_WIDTH - MARGIN_X, headerRuleY)
  renderer.setY(headerRuleY + 1)

  renderer.section('Professional Summary')
  renderer.text(getSummary(data, work))

  renderer.section('Core Skills')
  getCoreSkills(data).forEach(({ label, values }) => renderer.text(`${label}: ${values.join(', ')}`, { gap: 0.2 }))

  renderer.section('Professional Experience')
  work.forEach((step) => renderer.entry(step))

  renderer.section('Education')
  education.forEach((step) => renderer.entry(step, true))

  const awards = data.journey.flatMap((step) => step.details?.awards ?? [])
    .sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0))
  if (awards.length > 0) {
    renderer.section('Certifications & Recognition')
    awards.forEach((award) => renderer.bullet([award.title, award.issuer, award.year].filter(Boolean).join(' — ')))
  }

  if (data.projects.length > 0) {
    renderer.section('Selected Projects')
    data.projects.forEach(renderer.project)
  }

  return doc.output('blob')
}

export async function downloadCvPdf(data: PortfolioData): Promise<void> {
  const blob = await generateCvPdf(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'Francesco-Done-CV.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
