import path from 'node:path';
import { type Page, type TestInfo } from '@playwright/test';
import { expect, test } from '../../fixtures/persistent-playwright';
import {
  findCase,
  getValue,
  normalizeMechanism,
  parseNumber,
  readCsv,
  type CsvRow,
} from '../../utils/csv-data';
import {
  MECANISMOS,
  NAV,
  PAGO_MORA_PAG1,
  PAGO_MORA_PAG2,
} from '../../utils/selectors';
import {
  fillNumeric,
  loadPrincipal,
  login,
  nonEmpty,
  normalizedGxcText,
  normalizedText,
  readNumeric,
  readSelectLabel,
  selectLabel,
} from '../../utils/simulador-flow';

const dataPath = path.resolve(__dirname, '../../../data/datos_negociacion.csv');
const comparePath = path.resolve(__dirname, '../../../data/data_compare.csv');
const negotiationRows = readCsv(dataPath);
const comparisonRows = readCsv(comparePath);

async function loadPagoMora(page: Page, row: CsvRow): Promise<void> {
  await page.locator(MECANISMOS.pagoMora).click();
  await expect(page.locator(PAGO_MORA_PAG1.tab.tabpanel)).toBeVisible({ timeout: 30_000 });

  const esUnaTc = getValue(row, 'es_una_tc');
  if (nonEmpty(esUnaTc)) {
    await selectLabel(page, page.locator(PAGO_MORA_PAG1.esUnaTC.css), esUnaTc);
  }

  const pagoMinimo = getValue(row, 'pago_minimo');
  if (nonEmpty(pagoMinimo)) {
    await fillNumeric(page, PAGO_MORA_PAG1.pagoMinimo.css, pagoMinimo);
  }

  const interesCorriente = getValue(row, 'interes_cte');
  if (nonEmpty(interesCorriente)) {
    await fillNumeric(page, PAGO_MORA_PAG1.interesCorriente.css, interesCorriente);
  }

  const interesMora = getValue(row, 'interes_mora');
  if (nonEmpty(interesMora)) {
    await fillNumeric(page, PAGO_MORA_PAG1.interesMora.css, interesMora);
  }

  const pagoSnr = getValue(row, 'pago_snr', 'pago_al_snr');
  if (nonEmpty(pagoSnr)) {
    await fillNumeric(page, PAGO_MORA_PAG1.pagoAlSNR.css, pagoSnr);
  }

  const valorGxc = getValue(row, 'valorgastosGXC');
  if (nonEmpty(valorGxc)) {
    await fillNumeric(page, PAGO_MORA_PAG1.valorGxcPiloto.css, valorGxc);
  }

  await page
    .locator(PAGO_MORA_PAG1.tab.tabpanel)
    .locator(`${NAV.rightArrowM}:visible`)
    .click();
  await expect(page.locator(PAGO_MORA_PAG2.tab.tabpanel)).toBeVisible({ timeout: 30_000 });

  const cuotaVencida = getValue(row, 'cuota_vencida');
  if (nonEmpty(cuotaVencida)) {
    await selectLabel(page, page.locator(PAGO_MORA_PAG2.cuotaVencida.css), cuotaVencida);
  }

  const fechaPago = getValue(row, 'fecha_pago');
  if (nonEmpty(fechaPago)) {
    const digits = fechaPago.replace(/\D/g, '');
    const dateDigits =
      digits.length === 6
        ? `20${digits.slice(4)}${digits.slice(2, 4)}${digits.slice(0, 2)}`
        : digits;
    const dateInput = page.locator('input[role="combobox"]:visible').last();
    await dateInput.click();
    await dateInput.press('ControlOrMeta+A');
    await dateInput.press('Backspace');
    await dateInput.type(dateDigits, { delay: 10 });
    await dateInput.press('Tab');
  }

  const tramite = getValue(row, 'tramite_excepcion', 'requiere_tramite_excepcion');
  if (nonEmpty(tramite)) {
    await selectLabel(page, page.locator(PAGO_MORA_PAG2.requiereTramiteExcepcion.css), tramite);
  }
}

const comparisonFields = [
  'gxc_honorarios',
  'linea',
  'tipo_cartera',
  'diasmora',
  'abono_minimo_max',
  'maximohonorarios',
  'honorarioscomfirm',
  'max_total_baja',
  'bajacuentaIntCte',
  'bajacuentaIntMora',
  'bajacuentaIntExtra',
  'valormaximopilotos',
  'valorGXCpilotoconfirm',
  'sox',
] as const;

function isPagoMoraCase(row: CsvRow): boolean {
  return (
    getValue(row, 'id_caso').toUpperCase().startsWith('PM_') ||
    normalizeMechanism(getValue(row, 'mecanismo')) === 'pagomora'
  );
}

function getPagoMoraCaseIds(): string[] {
  const ids = [...negotiationRows, ...comparisonRows]
    .filter(isPagoMoraCase)
    .map((row) => getValue(row, 'id_caso').trim().toUpperCase())
    .filter(Boolean);

  return [...new Set(ids)];
}

function getCaseDataError(
  caseId: string,
  negotiationCase: CsvRow | undefined,
  expectedCase: CsvRow | undefined
): string | undefined {
  if (!negotiationCase) {
    return `El caso ${caseId} existe en data_compare.csv, pero no en datos_negociacion.csv.`;
  }

  if (!expectedCase) {
    return `El caso ${caseId} existe en datos_negociacion.csv, pero no en data_compare.csv.`;
  }

  const negotiationMechanism = normalizeMechanism(getValue(negotiationCase, 'mecanismo'));
  const expectedMechanism = normalizeMechanism(getValue(expectedCase, 'mecanismo'));
  if (negotiationMechanism !== 'pagomora' || expectedMechanism !== 'pagomora') {
    return `El caso ${caseId} debe tener mecanismo Pago Mora en ambos archivos.`;
  }

  const negotiationDocument = getValue(negotiationCase, 'num_documento');
  const expectedDocument = getValue(expectedCase, 'num_documento');
  if (negotiationDocument && expectedDocument && negotiationDocument !== expectedDocument) {
    return (
      `El caso ${caseId} tiene documentos diferentes: ` +
      `${negotiationDocument} en datos_negociacion.csv y ${expectedDocument} en data_compare.csv.`
    );
  }

  return undefined;
}

async function comparePagoMora(
  page: Page,
  row: CsvRow,
  expected: CsvRow,
  testInfo: TestInfo
): Promise<void> {
  const actual: Record<string, string> = {
    gxc_honorarios: await readSelectLabel(page, PAGO_MORA_PAG1.aplicaHonorarios.css),
    linea: await readSelectLabel(page, PAGO_MORA_PAG1.linea.css),
    diasmora: await readNumeric(page, PAGO_MORA_PAG1.diasMora.css),
    tipo_cartera: await readSelectLabel(page, PAGO_MORA_PAG1.tipoCartera.css),
    abono_minimo_max: await readNumeric(page, PAGO_MORA_PAG1.abonoMinimoMaxPermitido.css),
    maximohonorarios: '0',
    honorarioscomfirm: '0',
    max_total_baja: await readNumeric(page, PAGO_MORA_PAG1.maxTotalBajaCuenta.css),
    bajacuentaIntCte: await readNumeric(page, PAGO_MORA_PAG1.maxBajaCuentaIntCte.css),
    bajacuentaIntMora: await readNumeric(page, PAGO_MORA_PAG1.maxBajaCuentaIntMora.css),
    bajacuentaIntExtra: await readNumeric(page, PAGO_MORA_PAG1.maxBajaCuentaExtraCTC.css),
    valormaximopilotos: await readNumeric(page, PAGO_MORA_PAG1.maxValorPermitidoPilotoGXC.css),
    valorGXCpilotoconfirm: await readNumeric(page, PAGO_MORA_PAG1.valorGxcPiloto.css),
    sox: await page.locator(PAGO_MORA_PAG2.sox.css).inputValue(),
  };
  const actualFields = new Set(Object.keys(actual).map(normalizeMechanism));

  for (const field of Object.keys(expected)) {
    if (['id_caso', 'mecanismo', 'num_documento'].includes(field)) {
      continue;
    }

    const expectedValue = getValue(expected, field);
    if (nonEmpty(expectedValue) && !actualFields.has(normalizeMechanism(field))) {
      throw new Error(
        `El campo esperado "${field}" del caso ${getValue(row, 'id_caso')} ` +
          'no tiene una lectura configurada para Pago Mora.'
      );
    }
  }

  const comparisons = comparisonFields.map((field) => {
    const expectedValue = getValue(expected, field);
    if (!nonEmpty(expectedValue)) {
      return { field, skipped: true, expected: '', actual: actual[field], pass: true };
    }

    if (field === 'gxc_honorarios') {
      return {
        field,
        skipped: false,
        expected: expectedValue,
        actual: actual[field],
        pass: normalizedGxcText(actual[field]) === normalizedGxcText(expectedValue),
      };
    }

    if (['linea', 'tipo_cartera', 'sox'].includes(field)) {
      return {
        field,
        skipped: false,
        expected: expectedValue,
        actual: actual[field],
        pass: normalizedText(actual[field]) === normalizedText(expectedValue),
      };
    }

    return {
      field,
      skipped: false,
      expected: expectedValue,
      actual: actual[field],
      pass: parseNumber(actual[field]) === parseNumber(expectedValue),
    };
  });

  await testInfo.attach('datos-cargados.json', {
    body: JSON.stringify(row, null, 2),
    contentType: 'application/json',
  });
  await testInfo.attach('resultado-comparacion.json', {
    body: JSON.stringify({ actual, comparisons }, null, 2),
    contentType: 'application/json',
  });

  expect(comparisons.filter((comparison) => !comparison.pass), 'Diferencias de Pago Mora').toEqual([]);
}

const pagoMoraCases = negotiationRows.filter(
  isPagoMoraCase
);

for (const caseId of getPagoMoraCaseIds()) {
  const row = findCase(pagoMoraCases, caseId);
  const expected = findCase(comparisonRows, caseId);
  const dataError = getCaseDataError(caseId, row, expected);

  if (dataError) {
    test(`${caseId} - Pago Mora - validación de datos`, () => {
      throw new Error(dataError);
    });
    continue;
  }

  test(`${caseId} - Pago Mora`, async ({ page }, testInfo) => {
    await login(page);
    await loadPrincipal(page, row!);
    await loadPagoMora(page, row!);
    await comparePagoMora(page, row!, expected!, testInfo);
  });
}
