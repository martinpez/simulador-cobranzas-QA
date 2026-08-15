import path from 'node:path';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
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
  await expect(page.locator(PAGO_MORA_PAG1.pagoAlSNR.css)).toBeAttached();

  const esUnaTc = getValue(row, 'es_una_tc');
  if (nonEmpty(esUnaTc)) {
    await selectLabel(page.locator(PAGO_MORA_PAG1.esUnaTC.css), esUnaTc);
  }

  const pagoMinimo = getValue(row, 'pago_minimo');
  if (nonEmpty(pagoMinimo)) {
    await fillNumeric(page, PAGO_MORA_PAG1.pagoMinimo.css, pagoMinimo);
  }

  const interesCorriente = getValue(row, 'interes_cte', 'interes_corriente');
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

  await page.locator(`${NAV.rightArrowM}:visible`).click();
  await expect(page.locator(PAGO_MORA_PAG2.cuotaVencida.css)).toBeAttached();

  const cuotaVencida = getValue(row, 'cuota_vencida');
  if (nonEmpty(cuotaVencida)) {
    await selectLabel(page.locator(PAGO_MORA_PAG2.cuotaVencida.css), cuotaVencida);
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
    await selectLabel(page.locator(PAGO_MORA_PAG2.requiereTramiteExcepcion.css), tramite);
  }
}

async function comparePagoMora(page: Page, row: CsvRow, testInfo: TestInfo): Promise<void> {
  const caseId = getValue(row, 'id_caso');
  const expected = findCase(comparisonRows, caseId);
  expect(expected, `No existe resultado esperado para ${caseId}`).toBeTruthy();

  const actual: Record<string, string> = {
    gxc_honorarios: await readSelectLabel(page, PAGO_MORA_PAG1.aplicaHonorarios.css),
    abono_minimo_max: await readNumeric(page, PAGO_MORA_PAG1.abonoMinimoMaxPermitido.css),
    max_total_baja: await readNumeric(page, PAGO_MORA_PAG1.maxTotalBajaCuenta.css),
    bajacuentaIntCte: await readNumeric(page, PAGO_MORA_PAG1.maxBajaCuentaIntCte.css),
    bajacuentaIntMora: await readNumeric(page, PAGO_MORA_PAG1.maxBajaCuentaIntMora.css),
    bajacuentaIntExtra: await readNumeric(page, PAGO_MORA_PAG1.maxBajaCuentaExtraCTC.css),
    sox: await page.locator(PAGO_MORA_PAG2.sox.css).inputValue(),
  };

  const comparisons = Object.keys(actual).map((field) => {
    const expectedValue = getValue(expected!, field);
    if (!nonEmpty(expectedValue)) {
      return { field, skipped: true, expected: '', actual: actual[field], pass: true };
    }

    if (field === 'gxc_honorarios' || field === 'sox') {
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
  (row) =>
    getValue(row, 'id_caso').toUpperCase().startsWith('PM_') &&
    normalizeMechanism(getValue(row, 'mecanismo')) === 'pagomora'
);

for (const row of pagoMoraCases) {
  const caseId = getValue(row, 'id_caso').toUpperCase();
  test(`${caseId} - Pago Mora`, async ({ page }, testInfo) => {
    await login(page);
    await loadPrincipal(page, row);
    await loadPagoMora(page, row);
    await comparePagoMora(page, row, testInfo);
  });
}
