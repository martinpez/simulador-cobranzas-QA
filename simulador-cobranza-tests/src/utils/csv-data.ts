import fs from 'node:fs';

export type CsvRow = Record<string, string>;

function normalizeHeader(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (!quoted && character === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (!quoted && character === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += character;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((value) => value !== ''));
}

export function readCsv(filePath: string): CsvRow[] {
  const rows = parseCsv(fs.readFileSync(filePath, 'utf8'));
  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader);
  if (headers.some((header) => header === '')) {
    throw new Error(`El CSV contiene un encabezado vacío: ${filePath}`);
  }

  return rows.slice(1).map((values, rowIndex) => {
    const record: CsvRow = {};

    headers.forEach((header, columnIndex) => {
      const value = (values[columnIndex] ?? '').trim();
      if (!value) {
        return;
      }

      const previousValue = record[header];
      if (previousValue && previousValue !== value) {
        throw new Error(
          `El CSV tiene valores diferentes para la columna repetida "${header}" ` +
            `en la fila ${rowIndex + 2}: "${previousValue}" y "${value}".`
        );
      }

      record[header] = value;
    });

    return record;
  });
}

export function getValue(row: CsvRow, ...names: string[]): string {
  for (const name of names) {
    const value = row[normalizeHeader(name)];
    if (value !== undefined && value !== '') {
      return value;
    }
  }
  return '';
}

export function findCase(rows: CsvRow[], id: string): CsvRow | undefined {
  const normalizedId = id.trim().toLowerCase();
  return rows.find((row) => getValue(row, 'id_caso').toLowerCase() === normalizedId);
}

export function normalizeMechanism(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function parseNumber(value: string): number {
  const normalized = value.replace(/[$\s]/g, '').replace(/,/g, '');
  const number = Number(normalized);
  if (!Number.isFinite(number)) {
    throw new Error(`No se pudo convertir a número el valor "${value}".`);
  }
  return number;
}
