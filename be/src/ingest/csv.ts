import { readFile } from 'node:fs/promises'

export type CsvRow = {
  columns: string[]
  lineNumber: number
}

export async function readCsvRows(filePath: string): Promise<CsvRow[]> {
  const text = await readFile(filePath, 'utf8')
  const rows: CsvRow[] = []

  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const lineNumber = index + 1
    const trimmed = line.trim()
    if (!trimmed || lineNumber === 1) {
      continue
    }

    rows.push({ columns: trimmed.split(','), lineNumber })
  }

  return rows
}

export function parseNumber(value: string, field: string, lineNumber: number): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${field} "${value}" on line ${lineNumber}`)
  }
  return parsed
}
