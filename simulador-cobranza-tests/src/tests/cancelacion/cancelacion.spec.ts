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
  CANCELACION_PAG1,
  CANCELACION_PAG2,
  MECANISMOS,
  NAV,
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

async function loadCancelacion(page: Page, row: CsvRow): Promise<void> {
  await page.locator(MECANISMOS.cancelacion).click();
  await expect(page.locator(CANCELACION_PAG1.pagoMinimo.css)).toBeAttached();

  const esUnaTc = getValue(row, 'es_una_tc');
  if (nonEmpty(esUnaTc)) {
    await selectLabel(page, page.locator(CANCELACION_PAG1.esUnaTC.css), esUnaTc);
  }

  const pagoMinimo = getValue(row, 'pago_minimo');
  if (nonEmpty(pagoMinimo)) {
    await fillNumeric(page, CANCELACION_PAG1.pagoMinimo.css, pagoMinimo);
  }

  const linea = getValue(row, 'linea');
  if (nonEmpty(linea)) {
    await selectLabel(page, page.locator(CANCELACION_PAG1.linea.css), linea);
  }

  const diasMora = getValue(row, 'dias_mora');
  if (nonEmpty(diasMora)) {
    await fillNumeric(page, CANCELACION_PAG1.diasMora.css, diasMora);
  }

  const tipoCartera = getValue(row, 'tipo_cartera');
  if (nonEmpty(tipoCartera)) {
    await selectLabel(page, page.locator(CANCELACION_PAG1.tipoCartera.css), tipoCartera);
  }

  const saldoTotal = getValue(row, 'saldo_total');
  if (nonEmpty(saldoTotal)) {
    await fillNumeric(page, CANCELACION_PAG1.saldoTotal.css, saldoTotal);
  }

  const interesCorriente = getValue(row, 'interes_cte', 'interes_corriente');
  if (nonEmpty(interesCorriente)) {
    await fillNumeric(page, CANCELACION_PAG1.interesCorriente.css, interesCorriente);
  }

  const interesMora = getValue(row, 'interes_mora');
  if (nonEmpty(interesMora)) {
    await fillNumeric(page, CANCELACION_PAG1.interesMora.css, interesMora);
  }

  const interesExtra = getValue(row, 'interes_extracontables_tc', 'interes_extracontable_tc');
  if (nonEmpty(interesExtra)) {
    await fillNumeric(page, CANCELACION_PAG1.interesExtracontablesTC.css, interesExtra);
  }

  const capitalTotal = getValue(row, 'capital_total');
  if (nonEmpty(capitalTotal)) {
    await fillNumeric(page, CANCELACION_PAG1.capitalTotal.css, capitalTotal);
  }

  const pagoSnr = getValue(row, 'pago_snr', 'pago_al_snr');
  if (nonEmpty(pagoSnr)) {
    await fillNumeric(page, CANCELACION_PAG1.pagoAlSNR.css, pagoSnr);
  }

  const honorarios = getValue(row, 'honorarios');
  if (nonEmpty(honorarios)) {
    await fillNumeric(page, CANCELACION_PAG1.honorarios.css, honorarios);
  }

  const requiereTramite = getValue(row, 'requiere_tramite');
  if (nonEmpty(requiereTramite)) {
    await selectLabel(page, page.locator(CANCELACION_PAG1.requiereTramite.css), requiereTramite);
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

  await page.locator(`${NAV.rightArrowCA1}:visible`).click();
  await expect(page.locator(CANCELACION_PAG2.plantillaSOX.css)).toBeAttached();
}

const comparisonFields = [
  'gxc_honorarios',
  'linea',
  'tipo_cartera',
  'abono_minimo_max',
  'maximohonorarios',
  'max_total_baja',
  'bajacuentaIntCte',
  'bajacuentaIntMora',
  'bajacuentaIntExtra',
  'sox',
] as const;

function isCancelacionCase(row: CsvRow): boolean {
  return (
    getValue(row, 'id_caso').toUpperCase().startsWith('CAN_') ||
    normalizeMechanism(getValue(row, 'mecanismo')) === 'cancelacion'
  );
}

function getCancelacionCaseIds(): string[] {
  const ids = [...negotiationRows, ...comparisonRows]
    .filter(isCancelacionCase)
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
  if (negotiationMechanism !== 'cancelacion' || expectedMechanism !== 'cancelacion') {
    return `El caso ${caseId} debe tener mecanismo Cancelación en ambos archivos.`;
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

async function compareCancelacion(
  page: Page,
  row: CsvRow,
  expected: CsvRow,
  testInfo: TestInfo
): Promise<void> {
  const actual: Record<string, string> = {
    gxc_honorarios: await readSelectLabel(page, CANCELACION_PAG1.aplicaHonorarios.css),
    linea: await readSelectLabel(page, CANCELACION_PAG1.linea.css),
    tipo_cartera: await readSelectLabel(page, CANCELACION_PAG1.tipoCartera.css),
    abono_minimo_max: await readNumeric(
      page,
      CANCELACION_PAG1.abonoMinimoMaxPermitido.css
    ),
    maximohonorarios: await readNumeric(page, CANCELACION_PAG1.valorHonorariosMaximo.css),
    max_total_baja: await readNumeric(page, CANCELACION_PAG1.maxBajaEnCuentas.css),
    bajacuentaIntCte: await readNumeric(page, CANCELACION_PAG1.bajaCuentaIntCte.css),
    bajacuentaIntMora: await readNumeric(page, CANCELACION_PAG1.bajaCuentaIntMora.css),
    bajacuentaIntExtra: await readNumeric(page, CANCELACION_PAG1.bajaCuentaIntExtracTC.css),
    sox: await page.locator(CANCELACION_PAG2.plantillaSOX.css).inputValue(),
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
          'no tiene una lectura configurada para Cancelación.'
      );
    }
  }

  const comparisons = comparisonFields.map((field) => {
    const expectedValue = getValue(expected, field);
    if (!nonEmpty(expectedValue)) {
      return { field, skipped: true, expected: '', actual: actual[field], pass: true };
    }

    if (['gxc_honorarios', 'linea', 'tipo_cartera', 'sox'].includes(field)) {
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

  expect(comparisons.filter((comparison) => !comparison.pass), 'Diferencias de Cancelación').toEqual(
    []
  );
}

const cancelacionCases = negotiationRows.filter(isCancelacionCase);

for (const caseId of getCancelacionCaseIds()) {
  const row = findCase(cancelacionCases, caseId);
  const expected = findCase(comparisonRows, caseId);
  const dataError = getCaseDataError(caseId, row, expected);

  if (dataError) {
    test(`${caseId} - Cancelación - validación de datos`, () => {
      throw new Error(dataError);
    });
    continue;
  }

  test(`${caseId} - Cancelación`, async ({ page }, testInfo) => {
    await login(page);
    await loadPrincipal(page, row!);
    await loadCancelacion(page, row!);
    await compareCancelacion(page, row!, expected!, testInfo);
  });
}
